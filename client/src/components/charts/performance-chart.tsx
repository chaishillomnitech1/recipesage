import { Progress } from "@/components/ui/progress";

interface PerformanceMetric {
  label: string;
  value: number;
  unit: string;
  color: string;
}

interface PerformanceChartProps {
  metrics?: PerformanceMetric[];
}

const defaultMetrics: PerformanceMetric[] = [
  { label: "CPU Usage", value: 67, unit: "%", color: "hsl(217 91% 60%)" },
  { label: "Memory Usage", value: 43, unit: "%", color: "hsl(173 58% 39%)" },
  { label: "Storage", value: 28, unit: "%", color: "hsl(43 74% 66%)" },
];

export default function PerformanceChart({ metrics = defaultMetrics }: PerformanceChartProps) {
  return (
    <div className="space-y-6">
      {metrics.map((metric, index) => (
        <div key={index}>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">{metric.label}</span>
            <span className="text-foreground font-medium">
              {metric.value}{metric.unit}
            </span>
          </div>
          <Progress 
            value={metric.value} 
            className="h-2"
            style={{
              // @ts-ignore - Custom CSS property
              '--progress-foreground': metric.color
            }}
          />
        </div>
      ))}
      
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Database Connections</span>
          <span className="text-sm font-medium text-foreground">127/500</span>
        </div>
      </div>
    </div>
  );
}
