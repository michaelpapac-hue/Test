import crypto from 'node:crypto';
import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { createAuditLog } from '../middleware/audit.js';
import { generateDailySummary, runSafetyVisionScan } from '../services/ai.service.js';
import { streamDailyReportPdf } from '../services/pdf.service.js';
import { sendHotItemNotification } from '../services/push.service.js';
import { calculateRiskScore } from '../services/riskScoring.service.js';
import { storeImageAndGetUrl } from '../services/storage.service.js';

const reportSchema = z.object({
  projectId: z.string(),
  date: z.string().datetime(),
  weather: z.string(),
  temperature: z.number().optional(),
  shiftDuration: z.number().optional(),
  workCompleted: z.string(),
  delays: z.array(z.string()).default([]),
  safetyIncidents: z.boolean().default(false),
  safetyDescription: z.string().optional(),
  nearMisses: z.string().optional(),
  toolboxTalkTopic: z.string().optional(),
  laborEntries: z.array(
    z.object({
      company: z.string(),
      trade: z.string(),
      workers: z.number().int().nonnegative(),
      hours: z.number().nonnegative(),
      overtime: z.number().nonnegative().default(0),
    }),
  ),
  equipmentEntries: z.array(
    z.object({
      equipmentType: z.string(),
      hours: z.number().nonnegative(),
      ownership: z.enum(['OWNED', 'RENTED']),
    }),
  ),
  materialEntries: z.array(
    z.object({
      supplier: z.string(),
      description: z.string(),
      quantity: z.number().positive(),
      poNumber: z.string(),
    }),
  ),
});

export async function createDailyReport(req: Request, res: Response) {
  const payload = reportSchema.parse(req.body);
  const superintendentId = req.authUser!.id;

  const report = await prisma.dailyReport.create({
    data: {
      projectId: payload.projectId,
      date: payload.date,
      weather: payload.weather,
      temperature: payload.temperature,
      shiftDuration: payload.shiftDuration,
      summary: payload.workCompleted,
      delays: payload.delays,
      safetyIncidents: payload.safetyIncidents,
      safetyDescription: payload.safetyDescription,
      nearMisses: payload.nearMisses,
      toolboxTalkTopic: payload.toolboxTalkTopic,
      superintendentId,
      laborEntries: { createMany: { data: payload.laborEntries } },
      equipmentEntries: { createMany: { data: payload.equipmentEntries } },
      materialEntries: { createMany: { data: payload.materialEntries } },
    },
    include: { laborEntries: true },
  });

  await createAuditLog(superintendentId, 'CREATE', 'DailyReport', report.id, { projectId: payload.projectId });
  return res.status(201).json(report);
}

export async function uploadReportPhoto(req: Request, res: Response) {
  const reportId = req.params.reportId;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'Missing file' });
  }

  const imageUrl = await storeImageAndGetUrl(file.originalname);
  const scan = await runSafetyVisionScan(imageUrl);

  const hotItemsOpen = await prisma.hotItem.count({
    where: {
      projectId: req.body.projectId,
      status: 'OPEN',
    },
  });

  const riskScore = calculateRiskScore(scan.flags, hotItemsOpen);

  const photo = await prisma.photo.create({
    data: {
      reportId,
      imageUrl,
      aiFlags: scan.flags,
      aiCaption: scan.caption,
      aiRiskScore: riskScore,
      tags: req.body.tags ? String(req.body.tags).split(',') : [],
    },
  });

  await prisma.aIScanLog.create({
    data: {
      photoId: photo.id,
      modelVersion: scan.modelVersion,
      rawResult: scan.rawResult,
      immutableHash: crypto.createHash('sha256').update(JSON.stringify(scan.rawResult)).digest('hex'),
    },
  });

  if (riskScore >= 7) {
    const report = await prisma.dailyReport.findUniqueOrThrow({ where: { id: reportId } });
    await prisma.hotItem.create({
      data: {
        projectId: report.projectId,
        createdFrom: 'AI',
        description: `AI hazard in photo ${photo.id}: ${scan.flags.join(', ')}`,
        riskScore,
      },
    });

    const receivers = await prisma.user.findMany({
      where: {
        companyId: req.authUser!.companyId,
        role: { in: ['PM', 'SAFETY'] },
        notificationToken: { not: null },
      },
      select: { notificationToken: true },
    });

    await sendHotItemNotification(
      receivers.flatMap((r) => (r.notificationToken ? [r.notificationToken] : [])),
      'Hot Item Alert',
      `High risk safety issue detected (${riskScore}/10).`,
    );
  }

  return res.status(201).json(photo);
}

export async function finalizeReport(req: Request, res: Response) {
  const reportId = req.params.reportId;
  const report = await prisma.dailyReport.findUniqueOrThrow({
    where: { id: reportId },
    include: { laborEntries: true, photos: true, project: true, superintendent: true },
  });

  const avgPhotoRisk = report.photos.length
    ? report.photos.reduce((sum, p) => sum + p.aiRiskScore, 0) / report.photos.length
    : 0;

  const finalRisk = Math.min(10, Math.round(avgPhotoRisk));
  const laborHours = report.laborEntries.reduce((sum, l) => sum + l.hours, 0);

  const aiSummary = await generateDailySummary({
    workCompleted: report.summary ?? '',
    delays: report.delays,
    safetyNotes: report.safetyDescription ?? undefined,
    laborHours,
    riskScore: finalRisk,
  });

  const updated = await prisma.dailyReport.update({
    where: { id: reportId },
    data: {
      aiSummary,
      riskScore: finalRisk,
      lockedAt: new Date(),
    },
  });

  await createAuditLog(req.authUser!.id, 'FINALIZE', 'DailyReport', reportId, { riskScore: finalRisk });

  return res.json(updated);
}

export async function exportReportPdf(req: Request, res: Response) {
  const report = await prisma.dailyReport.findUniqueOrThrow({
    where: { id: req.params.reportId },
    include: { project: true, superintendent: true },
  });

  streamDailyReportPdf(res, {
    projectName: report.project.name,
    date: report.date.toISOString().split('T')[0],
    superintendent: report.superintendent.name,
    weather: report.weather,
    aiSummary: report.aiSummary,
  });
}
