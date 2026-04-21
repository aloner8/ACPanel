import type { FastifyPluginAsync } from 'fastify';
import { appPackageSchema } from '@acpanel/shared';

export const packageRoutes: FastifyPluginAsync = async (app) => {
  app.get('/packages', async () => {
    return app.prisma.appPackage.findMany({
      orderBy: { createdAt: 'desc' }
    });
  });

  app.post('/packages', async (request, reply) => {
    const payload = appPackageSchema.parse(request.body);

    const appPackage = await app.prisma.appPackage.create({
      data: payload
    });

    return reply.code(201).send(appPackage);
  });
};
