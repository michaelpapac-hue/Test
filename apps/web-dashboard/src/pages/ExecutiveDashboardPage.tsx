import React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const riskTrend = [
  { day: 'Mon', risk: 4 },
  { day: 'Tue', risk: 6 },
  { day: 'Wed', risk: 5 },
  { day: 'Thu', risk: 7 },
  { day: 'Fri', risk: 3 },
];

const cardStyle: React.CSSProperties = {
  background: '#121a24',
  color: '#f8fafc',
  borderRadius: 12,
  padding: 16,
};

export function ExecutiveDashboardPage() {
  return (
    <main style={{ fontFamily: 'Inter, sans-serif', background: '#090d13', minHeight: '100vh', padding: 24, color: '#fff' }}>
      <h1>Executive Dashboard</h1>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
        <div style={cardStyle}>Projects at Risk: 5</div>
        <div style={cardStyle}>Open Hot Items: 14</div>
        <div style={cardStyle}>Daily Variance: +8%</div>
        <div style={cardStyle}>Safety Heat Zones: 3</div>
      </section>

      <section style={{ ...cardStyle, marginTop: 16 }}>
        <h3>AI Risk Score Trend</h3>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={riskTrend}>
              <XAxis dataKey="day" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip />
              <Line type="monotone" dataKey="risk" stroke="#f97316" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </main>
  );
}
