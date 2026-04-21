import { UserRole } from '@prisma/client';
import type { FastifyPluginAsync } from 'fastify';
import { appPackageSchema } from '@acpanel/shared';

export const packageRoutes: FastifyPluginAsync = async (app) => {
  app.get('/packages', { preHandler: app.authenticate }, async () => {
    return app.prisma.appPackage.findMany({
      orderBy: { createdAt: 'desc' }
    });
  });

  app.post('/packages', { preHandler: app.requireRoles([UserRole.ADMIN, UserRole.OPERATOR]) }, async (request, reply) => {
    const payload = appPackageSchema.parse(request.body);

    const appPackage = await app.prisma.appPackage.create({
      data: payload
    });

    return reply.code(201).send(appPackage);
  });
};
