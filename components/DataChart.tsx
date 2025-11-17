
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MunicipalityData } from '../types';
import Card from './ui/Card';

interface DataChartProps {
  data: MunicipalityData[];
}

const formatCurrency = (value: number) => {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toString();
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-slate-700 border border-slate-600 rounded-md shadow-lg text-sm">
        <p className="font-bold text-sky-300">{label}</p>
        <p className="text-slate-300">{`Receita Total: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

const DataChart: React.FC<DataChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    return [...data]
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 15)
      .map(d => ({
        name: d.entity,
        'Receita Total': d.totalRevenue
      }));
  }, [data]);

  return (
    <Card>
      <h2 className="text-xl font-bold text-sky-300 mb-4">Top 15 Municípios por Receita Total</h2>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{
              top: 5, right: 20, left: 30, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} fontSize={12} interval={0} angle={-35} textAnchor="end" height={80} />
            <YAxis tick={{ fill: '#94a3b8' }} tickFormatter={formatCurrency} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(71, 85, 105, 0.5)' }}/>
            <Legend wrapperStyle={{ color: '#cbd5e1' }} />
            <Bar dataKey="Receita Total" fill="#22d3ee" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default DataChart;
