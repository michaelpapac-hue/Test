import PDFDocument from 'pdfkit';
import { Response } from 'express';

export function streamDailyReportPdf(res: Response, report: {
  projectName: string;
  date: string;
  superintendent: string;
  weather: string;
  aiSummary?: string | null;
}) {
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="daily-report-${report.date}.pdf"`);
  doc.pipe(res);

  doc.fontSize(20).text('Construction Daily Report');
  doc.moveDown();
  doc.fontSize(12).text(`Project: ${report.projectName}`);
  doc.text(`Date: ${report.date}`);
  doc.text(`Superintendent: ${report.superintendent}`);
  doc.text(`Weather: ${report.weather}`);
  doc.moveDown();
  doc.text('AI Summary');
  doc.fontSize(10).text(report.aiSummary ?? 'No AI summary generated.');

  doc.end();
}
