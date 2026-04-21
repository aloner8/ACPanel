import { UserRole } from '@prisma/client';
import type { FastifyPluginAsync } from 'fastify';
import { domainSchema } from '@acpanel/shared';

export const domainRoutes: FastifyPluginAsync = async (app) => {
  app.get('/domains', { preHandler: app.authenticate }, async () => {
    return app.prisma.domain.findMany({
      include: {
        customer: true,
        configs: true
      },
      orderBy: { createdAt: 'desc' }
    });
  });

  app.get('/domains/:id', { preHandler: app.authenticate }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const domain = await app.prisma.domain.findUnique({
      where: { id },
      include: {
        customer: true,
        configs: true
      }
    });

    if (!domain) {
      return reply.notFound('Domain not found.');
    }

    return domain;
  });

  app.post('/domains', { preHandler: app.requireRoles([UserRole.ADMIN, UserRole.OPERATOR]) }, async (request, reply) => {
    const payload = domainSchema.parse(request.body);

    const domain = await app.prisma.domain.create({
      data: {
        ...payload,
        fqdn: payload.subdomain ? `${payload.subdomain}.${payload.rootDomain}` : payload.rootDomain
      }
    });

    return reply.code(201).send(domain);
  });

  app.put('/domains/:id', { preHandler: app.requireRoles([UserRole.ADMIN, UserRole.OPERATOR]) }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const payload = domainSchema.parse(request.body);

    const existing = await app.prisma.domain.findUnique({
      where: { id }
    });

    if (!existing) {
      return reply.notFound('Domain not found.');
    }

    const domain = await app.prisma.domain.update({
      where: { id },
      data: {
        ...payload,
        fqdn: payload.subdomain ? `${payload.subdomain}.${payload.rootDomain}` : payload.rootDomain
      }
    });

    return domain;
  });

  app.delete('/domains/:id', { preHandler: app.requireRoles([UserRole.ADMIN]) }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const existing = await app.prisma.domain.findUnique({
      where: { id }
    });

    if (!existing) {
      return reply.notFound('Domain not found.');
    }

    await app.prisma.domain.delete({
      where: { id }
    });

    return reply.code(204).send();
  });
};
