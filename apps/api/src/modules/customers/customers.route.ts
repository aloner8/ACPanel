import type { FastifyPluginAsync } from 'fastify';
import { customerSchema } from '@acpanel/shared';

export const customerRoutes: FastifyPluginAsync = async (app) => {
  app.get('/customers', async () => {
    return app.prisma.customer.findMany({
      orderBy: { createdAt: 'desc' }
    });
  });

  app.post('/customers', async (request, reply) => {
    const payload = customerSchema.parse(request.body);

    const customer = await app.prisma.customer.create({
      data: payload
    });

    return reply.code(201).send(customer);
  });
};
