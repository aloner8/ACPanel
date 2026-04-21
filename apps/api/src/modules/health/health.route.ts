import type { FastifyPluginAsync } from 'fastify';

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get('/health', async () => {
    const database = await app.prisma.$queryRaw`SELECT 1`;

    return {
      status: 'ok',
      database: Array.isArray(database) ? 'connected' : 'unknown',
      service: 'acpanel-api'
    };
  });
};
