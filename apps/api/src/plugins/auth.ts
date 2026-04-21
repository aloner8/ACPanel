import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import type { UserRole } from '@prisma/client';
import { env } from '../config/env.js';

export const authPlugin = fp(async (app) => {
  await app.register(jwt, {
    secret: env.JWT_SECRET
  });

  app.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.unauthorized('Authentication required.');
    }
  });

  app.decorate('requireRoles', (roles: UserRole[]) => {
    return async (request, reply) => {
      await app.authenticate(request, reply);

      if (reply.sent) {
        return;
      }

      const role = request.user.role;

      if (!roles.includes(role)) {
        return reply.forbidden('You do not have permission to access this resource.');
      }
    };
  });
});

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string;
      email: string;
      role: UserRole;
      displayName: string;
    };
    user: {
      sub: string;
      email: string;
      role: UserRole;
      displayName: string;
    };
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: import('fastify').FastifyRequest, reply: import('fastify').FastifyReply) => Promise<void>;
    requireRoles: (roles: UserRole[]) => (request: import('fastify').FastifyRequest, reply: import('fastify').FastifyReply) => Promise<void>;
  }
}
