import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

export async function getExecutiveDashboard(req: Request, res: Response) {
  const companyId = req.authUser!.companyId;

  const [projects, openHotItems, reportsToday] = await Promise.all([
    prisma.project.count({ where: { companyId } }),
    prisma.hotItem.findMany({
      where: { project: { companyId }, status: 'OPEN' },
      include: { project: true },
      take: 20,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.dailyReport.count({
      where: {
        project: { companyId },
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  const riskTrend = await prisma.dailyReport.groupBy({
    by: ['date'],
    where: { project: { companyId } },
    _avg: { riskScore: true },
    orderBy: { date: 'asc' },
    take: 14,
  });

  return res.json({
    projects,
    reportsToday,
    openHotItemsCount: openHotItems.length,
    openHotItems,
    riskTrend,
  });
}
