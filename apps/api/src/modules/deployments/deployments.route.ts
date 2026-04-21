import { UserRole } from '@prisma/client';
import type { FastifyPluginAsync } from 'fastify';

export const deploymentRoutes: FastifyPluginAsync = async (app) => {
  app.get('/deployments', { preHandler: app.requireRoles([UserRole.ADMIN, UserRole.OPERATOR, UserRole.SUPPORT]) }, async () => {
    return app.prisma.deploymentJob.findMany({
      include: {
        customer: true,
        domain: true,
        script: true
      },
      orderBy: { createdAt: 'desc' }
    });
  });
};
