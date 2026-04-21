import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { authPlugin } from './plugins/auth.js';
import { prismaPlugin } from './plugins/prisma.js';
import { authRoutes } from './modules/auth/auth.route.js';
import { healthRoutes } from './modules/health/health.route.js';
import { customerRoutes } from './modules/customers/customers.route.js';
import { domainRoutes } from './modules/domains/domains.route.js';
import { packageRoutes } from './modules/packages/packages.route.js';
import { activityLogRoutes } from './modules/activity-logs/activity-logs.route.js';
import { deploymentRoutes } from './modules/deployments/deployments.route.js';
import { backupRoutes } from './modules/backups/backups.route.js';

export async function buildApp() {
  const app = Fastify({
    logger: true
  });

  await app.register(cors, {
    origin: true
  });
  await app.register(sensible);
  await app.register(prismaPlugin);
  await app.register(authPlugin);

  await app.register(healthRoutes, { prefix: '/api' });
  await app.register(authRoutes, { prefix: '/api' });
  await app.register(customerRoutes, { prefix: '/api' });
  await app.register(domainRoutes, { prefix: '/api' });
  await app.register(packageRoutes, { prefix: '/api' });
  await app.register(activityLogRoutes, { prefix: '/api' });
  await app.register(deploymentRoutes, { prefix: '/api' });
  await app.register(backupRoutes, { prefix: '/api' });

  return app;
}
