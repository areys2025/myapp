
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartDataItem } from '../../types';

interface ReportChartProps {
  data: ChartDataItem[];
  title: string;
  chartType?: 'bar' | 'pie';
  dataKey?: string; // For BarChart, the key for the bar value
  nameKey?: string; // For PieChart, the key for the name/label
}

const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']; // primary, secondary, pink, amber, emerald, blue

const ReportChart: React.FC<ReportChartProps> = ({ data, title, chartType = 'bar', dataKey = 'value', nameKey = 'name' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center text-neutral-DEFAULT bg-white shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p>No data available for this report.</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-white shadow-lg rounded-lg h-96">
      <h3 className="text-xl font-semibold text-neutral-dark mb-4 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height="85%">
        {chartType === 'bar' ? (
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill="#06b6d4" /> {/* primary color */}
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey={nameKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ReportChart;
