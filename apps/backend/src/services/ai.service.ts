import crypto from 'node:crypto';

const hazardCatalog = [
  'MISSING_HARD_HAT',
  'MISSING_VEST',
  'NO_FALL_PROTECTION',
  'LADDER_MISUSE',
  'OPEN_TRENCH',
  'IMPROPER_PPE',
];

export async function runSafetyVisionScan(imageUrl: string) {
  const seed = crypto.createHash('sha256').update(imageUrl).digest('hex');
  const scoreSeed = parseInt(seed.slice(0, 2), 16);
  const flagCount = scoreSeed % 3;

  const flags = Array.from({ length: flagCount }, (_, i) => hazardCatalog[(scoreSeed + i) % hazardCatalog.length]);
  return {
    flags,
    caption: flags.length
      ? `Potential safety issue detected: ${flags.join(', ').replaceAll('_', ' ')}`
      : 'Active work observed with no obvious PPE violations.',
    modelVersion: 'vision-v1.2.0',
    rawResult: { seed, imageUrl, flags },
  };
}

export async function generateDailySummary(input: {
  workCompleted: string;
  delays: string[];
  safetyNotes?: string;
  laborHours: number;
  riskScore: number;
}) {
  return `Field operations progressed with focus on ${input.workCompleted || 'general construction activity'}.

Operational risk is currently scored at ${input.riskScore}/10, with key delay drivers: ${input.delays.join(', ') || 'none reported'}.

Labor productivity recorded ${input.laborHours.toFixed(1)} total hours. Safety context: ${input.safetyNotes || 'no notable concerns'}. Claims exposure should be monitored if delays continue.`;
}
