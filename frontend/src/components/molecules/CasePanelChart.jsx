import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function ChartTooltip({ active, payload, formatMetricValue }) {
  if (!active || !payload?.length) return null;

  const { name, value } = payload[0].payload;

  return (
    <div className="case-ticket-chart-tooltip">
      <strong>{name}</strong>
      <span>{formatMetricValue(value)}</span>
    </div>
  );
}

function CasePanelChart({ data, domainMax, formatMetricValue, isPercentage, label }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(motionPreference.matches);

    updatePreference();
    motionPreference.addEventListener('change', updatePreference);
    return () => motionPreference.removeEventListener('change', updatePreference);
  }, []);

  if (!data.length) {
    return (
      <div className="case-ticket-chart-empty">
        <span aria-hidden="true">▥</span>
        <p>Guarda un ticket para ver su gráfica</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer height={190} width="100%">
      <BarChart
        accessibilityLayer
        aria-label={label}
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 48, bottom: 4, left: 4 }}
      >
        <CartesianGrid
          horizontal={false}
          stroke="#e5eeed"
          strokeDasharray="3 5"
          vertical
        />
        <XAxis
          axisLine={false}
          domain={[0, domainMax]}
          tick={{ fill: '#78918f', fontSize: 11 }}
          tickFormatter={formatMetricValue}
          tickLine={false}
          tickCount={5}
          ticks={isPercentage ? [0, 25, 50, 75, 100] : undefined}
          type="number"
        />
        <YAxis
          axisLine={false}
          dataKey="name"
          tick={{ fill: '#52716d', fontSize: 11, fontWeight: 600 }}
          tickLine={false}
          type="category"
          width={84}
        />
        <Tooltip
          content={<ChartTooltip formatMetricValue={formatMetricValue} />}
          cursor={{ fill: '#f1f7f6', radius: 8 }}
        />
        <Bar
          animationDuration={450}
          isAnimationActive={!prefersReducedMotion}
          barSize={24}
          dataKey="value"
          minPointSize={2}
          radius={[0, 7, 7, 0]}
        >
          {data.map((item) => (
            <Cell fill={item.color} key={item.name} />
          ))}
          <LabelList
            className="case-ticket-chart-value"
            dataKey="value"
            formatter={formatMetricValue}
            position="right"
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default CasePanelChart;
