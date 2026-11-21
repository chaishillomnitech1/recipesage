import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface MintTrendsChartProps {
  data?: Array<{
    month: string;
    mints: number;
  }>;
}

const defaultData = [
  { month: 'Jan', mints: 12 },
  { month: 'Feb', mints: 29 },
  { month: 'Mar', mints: 48 },
  { month: 'Apr', mints: 67 },
  { month: 'May', mints: 89 },
  { month: 'Jun', mints: 134 },
  { month: 'Jul', mints: 167 },
];

export default function MintTrendsChart({ data = defaultData }: MintTrendsChartProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 17%)" />
          <XAxis 
            dataKey="month" 
            stroke="hsl(215 20% 65%)"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(215 20% 65%)"
            fontSize={12}
          />
          <Line 
            type="monotone" 
            dataKey="mints" 
            stroke="hsl(217 91% 60%)"
            strokeWidth={2}
            dot={{ fill: "hsl(217 91% 60%)", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "hsl(217 91% 60%)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
