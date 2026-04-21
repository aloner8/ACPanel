import { UserRole } from '@prisma/client';
import type { FastifyPluginAsync } from 'fastify';
import { appPackageSchema } from '@acpanel/shared';

export const packageRoutes: FastifyPluginAsync = async (app) => {
  app.get('/packages', { preHandler: app.authenticate }, async () => {
    return app.prisma.appPackage.findMany({
      orderBy: { createdAt: 'desc' }
    });
  });

  app.get('/packages/:id', { preHandler: app.authenticate }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const appPackage = await app.prisma.appPackage.findUnique({
      where: { id }
    });

    if (!appPackage) {
      return reply.notFound('Package not found.');
    }

    return appPackage;
  });

  app.post('/packages', { preHandler: app.requireRoles([UserRole.ADMIN, UserRole.OPERATOR]) }, async (request, reply) => {
    const payload = appPackageSchema.parse(request.body);

    const appPackage = await app.prisma.appPackage.create({
      data: payload
    });

    return reply.code(201).send(appPackage);
  });

  app.put('/packages/:id', { preHandler: app.requireRoles([UserRole.ADMIN, UserRole.OPERATOR]) }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const payload = appPackageSchema.parse(request.body);

    const existing = await app.prisma.appPackage.findUnique({
      where: { id }
    });

    if (!existing) {
      return reply.notFound('Package not found.');
    }

    const appPackage = await app.prisma.appPackage.update({
      where: { id },
      data: payload
    });

    return appPackage;
  });

  app.delete('/packages/:id', { preHandler: app.requireRoles([UserRole.ADMIN]) }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const existing = await app.prisma.appPackage.findUnique({
      where: { id }
    });

    if (!existing) {
      return reply.notFound('Package not found.');
    }

    await app.prisma.appPackage.delete({
      where: { id }
    });

    return reply.code(204).send();
  });
};
