import type { FastifyPluginAsync } from 'fastify';

export const refRoutes: FastifyPluginAsync = async (app) => {
  app.get('/refs/:refname', { preHandler: app.authenticate }, async (request, reply) => {
    const { refname } = request.params as { refname: string };

    const reference = await app.prisma.ref.findUnique({
      where: { refname }
    });

    if (!reference) {
      return reply.notFound('Reference not found.');
    }

    const values = Array.isArray(reference.refValues)
      ? reference.refValues.filter((value: unknown): value is string => typeof value === 'string')
      : [];

    return {
      id: reference.id,
      refname: reference.refname,
      values
    };
  });
};
