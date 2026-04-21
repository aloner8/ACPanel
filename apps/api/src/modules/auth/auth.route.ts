import type { FastifyPluginAsync } from 'fastify';
import { UserRole } from '@prisma/client';
import { bootstrapAdminSchema, loginSchema, userCreateSchema } from '@acpanel/shared';
import { env } from '../../config/env.js';
import { hashPassword, verifyPassword } from '../../lib/password.js';

function sanitizeUser(user: {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post('/auth/bootstrap', async (request, reply) => {
    const existingUsers = await app.prisma.user.count();

    if (existingUsers > 0) {
      return reply.conflict('Bootstrap is only available before the first user is created.');
    }

    const payload = bootstrapAdminSchema.parse(request.body);

    const passwordHash = await hashPassword(payload.password);

    const user = await app.prisma.user.create({
      data: {
        email: payload.email,
        displayName: payload.displayName,
        passwordHash,
        role: UserRole.ADMIN
      }
    });

    return reply.code(201).send({
      user: sanitizeUser(user)
    });
  });

  app.post('/auth/login', async (request, reply) => {
    const payload = loginSchema.parse(request.body);

    const user = await app.prisma.user.findUnique({
      where: {
        email: payload.email
      }
    });

    if (!user) {
      return reply.unauthorized('Invalid email or password.');
    }

    const isValidPassword = await verifyPassword(payload.password, user.passwordHash);

    if (!isValidPassword) {
      return reply.unauthorized('Invalid email or password.');
    }

    const token = await reply.jwtSign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        displayName: user.displayName
      },
      {
        expiresIn: env.JWT_EXPIRES_IN
      }
    );

    await app.prisma.activityLog.create({
      data: {
        actorId: user.id,
        action: 'auth.login',
        resourceType: 'user',
        resourceId: user.id,
        ipAddress: request.ip,
        metadata: {
          email: user.email
        }
      }
    });

    return {
      token,
      user: sanitizeUser(user)
    };
  });

  app.get('/auth/me', { preHandler: app.authenticate }, async (request, reply) => {
    const user = await app.prisma.user.findUnique({
      where: {
        id: request.user.sub
      }
    });

    if (!user) {
      return reply.notFound('Authenticated user no longer exists.');
    }

    return {
      user: sanitizeUser(user)
    };
  });

  app.get(
    '/auth/users',
    { preHandler: app.requireRoles([UserRole.ADMIN]) },
    async () => {
      const users = await app.prisma.user.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });

      return users.map(sanitizeUser);
    }
  );

  app.post(
    '/auth/users',
    { preHandler: app.requireRoles([UserRole.ADMIN]) },
    async (request, reply) => {
      const payload = userCreateSchema.parse(request.body);

      const passwordHash = await hashPassword(payload.password);

      const user = await app.prisma.user.create({
        data: {
          email: payload.email,
          displayName: payload.displayName,
          passwordHash,
          role: payload.role
        }
      });

      await app.prisma.activityLog.create({
        data: {
          actorId: request.user.sub,
          action: 'auth.user.create',
          resourceType: 'user',
          resourceId: user.id,
          ipAddress: request.ip,
          metadata: {
            email: user.email,
            role: user.role
          }
        }
      });

      return reply.code(201).send({
        user: sanitizeUser(user)
      });
    }
  );
};
