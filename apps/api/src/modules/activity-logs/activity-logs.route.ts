import { UserRole } from '@prisma/client';
import type { FastifyPluginAsync } from 'fastify';

export const activityLogRoutes: FastifyPluginAsync = async (app) => {
  app.get('/activity-logs', { preHandler: app.requireRoles([UserRole.ADMIN, UserRole.OPERATOR, UserRole.SUPPORT]) }, async () => {
    return app.prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });
  });
};
