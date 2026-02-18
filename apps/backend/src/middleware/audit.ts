import { prisma } from '../config/prisma.js';

export async function createAuditLog(userId: string, action: string, entity: string, entityId: string, meta?: unknown) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      meta: meta ? (meta as object) : undefined,
    },
  });
}
