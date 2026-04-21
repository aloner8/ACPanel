import type { FastifyPluginAsync } from 'fastify';

export const activityLogRoutes: FastifyPluginAsync = async (app) => {
  app.get('/activity-logs', async () => {
    return app.prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });
  });
};
