import { PrismaClient } from '@prisma/client';

declare global {
  var __acpanelPrisma__: PrismaClient | undefined;
}

export const prisma =
  globalThis.__acpanelPrisma__ ??
  new PrismaClient({
    log: ['warn', 'error']
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__acpanelPrisma__ = prisma;
}
