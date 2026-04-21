import type { FastifyPluginAsync } from 'fastify';

export const deploymentRoutes: FastifyPluginAsync = async (app) => {
  app.get('/deployments', async () => {
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
