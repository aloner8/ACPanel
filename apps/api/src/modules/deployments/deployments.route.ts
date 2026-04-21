import { UserRole } from '@prisma/client';
import type { FastifyPluginAsync } from 'fastify';
import { deploymentCreateSchema } from '@acpanel/shared';

export const deploymentRoutes: FastifyPluginAsync = async (app) => {
  app.get('/deployments', { preHandler: app.requireRoles([UserRole.ADMIN, UserRole.OPERATOR, UserRole.SUPPORT]) }, async () => {
    return app.prisma.deploymentJob.findMany({
      include: {
        customer: true,
        domain: true,
        script: {
          include: {
            appPackage: true
          }
        },
        requestedBy: true
      },
      orderBy: { createdAt: 'desc' }
    });
  });

  app.post('/deployments', { preHandler: app.requireRoles([UserRole.ADMIN, UserRole.OPERATOR]) }, async (request, reply) => {
    const payload = deploymentCreateSchema.parse(request.body);

    const [customer, domain, appPackage] = await Promise.all([
      app.prisma.customer.findUnique({ where: { id: payload.customerId } }),
      app.prisma.domain.findUnique({ where: { id: payload.domainId } }),
      app.prisma.appPackage.findUnique({ where: { id: payload.appPackageId } })
    ]);

    if (!customer) {
      return reply.notFound('Customer not found.');
    }

    if (!domain) {
      return reply.notFound('Domain not found.');
    }

    if (!appPackage) {
      return reply.notFound('Package not found.');
    }

    const script = await app.prisma.deploymentScript.create({
      data: {
        customerId: customer.id,
        domainId: domain.id,
        appPackageId: appPackage.id,
        scriptType: payload.scriptType,
        scriptName: `${payload.jobType}-${appPackage.slug}-${domain.fqdn}`,
        scriptPath: `/generated/${customer.code}/${domain.fqdn}/${appPackage.slug}.yaml`,
        runtime: payload.runtime ?? 'docker-stack',
        version: payload.requestedVersion ?? appPackage.version,
        isTemplate: false,
        contentHash: null
      }
    });

    const job = await app.prisma.deploymentJob.create({
      data: {
        customerId: customer.id,
        domainId: domain.id,
        scriptId: script.id,
        jobType: payload.jobType,
        status: 'PENDING',
        requestedById: request.user.sub,
        resultSummary: payload.notes ?? `Queued ${payload.jobType} for ${appPackage.name} on ${domain.fqdn}.`
      },
      include: {
        customer: true,
        domain: true,
        script: {
          include: {
            appPackage: true
          }
        },
        requestedBy: true
      }
    });

    await app.prisma.activityLog.create({
      data: {
        actorId: request.user.sub,
        customerId: customer.id,
        domainId: domain.id,
        action: 'deployment.create',
        resourceType: 'deployment_job',
        resourceId: job.id,
        ipAddress: request.ip,
        metadata: {
          appPackageId: appPackage.id,
          appPackageSlug: appPackage.slug,
          jobType: payload.jobType,
          requestedVersion: payload.requestedVersion ?? appPackage.version
        }
      }
    });

    return reply.code(201).send(job);
  });
};
