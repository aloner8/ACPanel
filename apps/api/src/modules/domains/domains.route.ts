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
};
