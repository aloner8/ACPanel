import type { FastifyPluginAsync } from 'fastify';

export const deploymentExecutor: FastifyPluginAsync = async (app) => {
  let running = true;

  app.addHook('onClose', async () => {
    running = false;
  });

  app.after(() => {
    (async function loop() {
      while (running) {
        try {
          const job = await app.prisma.deploymentJob.findFirst({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'asc' },
            include: { script: true }
          });

          if (!job) {
            await new Promise((r) => setTimeout(r, 2000));
            continue;
          }

          app.log.info({ jobId: job.id }, 'Picked pending deployment job');

          await app.prisma.deploymentJob.update({
            where: { id: job.id },
            data: { status: 'RUNNING', startedAt: new Date() }
          });

          // Placeholder execution: replace with real execution logic
          let success = true;
          let summary = 'Execution completed successfully.';

          try {
            // Simulate running the deployment script
            await new Promise((r) => setTimeout(r, 1500));
          } catch (err) {
            success = false;
            summary = `Execution error: ${String(err)}`;
          }

          const finalStatus = success ? 'SUCCESS' : 'FAILED';

          await app.prisma.deploymentJob.update({
            where: { id: job.id },
            data: {
              status: finalStatus,
              finishedAt: new Date(),
              resultSummary: summary
            }
          });

          // Update domain deployment status if applicable
          if (job.domainId) {
            try {
              await app.prisma.domain.update({
                where: { id: job.domainId },
                data: { deploymentStatus: finalStatus }
              });
            } catch (e) {
              app.log.error({ err: e, jobId: job.id }, 'Failed to update domain deploymentStatus');
            }
          }

          await app.prisma.activityLog.create({
            data: {
              actorId: null,
              customerId: job.customerId,
              domainId: job.domainId,
              action: 'deployment.execute',
              resourceType: 'deployment_job',
              resourceId: job.id,
              ipAddress: null,
              metadata: { finalStatus }
            }
          });
        } catch (err) {
          app.log.error({ err }, 'Executor loop error');
          await new Promise((r) => setTimeout(r, 5000));
        }
      }
    })();
  });
};
