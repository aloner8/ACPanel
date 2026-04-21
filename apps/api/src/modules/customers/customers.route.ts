import { UserRole } from '@prisma/client';
import type { FastifyPluginAsync } from 'fastify';
import { customerSchema } from '@acpanel/shared';

export const customerRoutes: FastifyPluginAsync = async (app) => {
  app.get('/customers', { preHandler: app.authenticate }, async () => {
    return app.prisma.customer.findMany({
      orderBy: { createdAt: 'desc' }
    });
  });

  app.get('/customers/:id', { preHandler: app.authenticate }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const customer = await app.prisma.customer.findUnique({
      where: { id }
    });

    if (!customer) {
      return reply.notFound('Customer not found.');
    }

    return customer;
  });

  app.post('/customers', { preHandler: app.requireRoles([UserRole.ADMIN, UserRole.OPERATOR]) }, async (request, reply) => {
    const payload = customerSchema.parse(request.body);

    const customer = await app.prisma.customer.create({
      data: payload
    });

    return reply.code(201).send(customer);
  });

  app.put('/customers/:id', { preHandler: app.requireRoles([UserRole.ADMIN, UserRole.OPERATOR]) }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const payload = customerSchema.parse(request.body);

    const existing = await app.prisma.customer.findUnique({
      where: { id }
    });

    if (!existing) {
      return reply.notFound('Customer not found.');
    }

    const customer = await app.prisma.customer.update({
      where: { id },
      data: payload
    });

    return customer;
  });

  app.delete('/customers/:id', { preHandler: app.requireRoles([UserRole.ADMIN]) }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const existing = await app.prisma.customer.findUnique({
      where: { id }
    });

    if (!existing) {
      return reply.notFound('Customer not found.');
    }

    await app.prisma.customer.delete({
      where: { id }
    });

    return reply.code(204).send();
  });
};
