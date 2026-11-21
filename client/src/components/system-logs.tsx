import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

interface SystemLog {
  id: string;
  level: string;
  message: string;
  category?: string;
  createdAt: string;
}

interface SystemLogsProps {
  limit?: number;
}

export default function SystemLogs({ limit = 10 }: SystemLogsProps) {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["/api/logs", { limit }],
  });

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'error':
        return 'bg-destructive/20 text-destructive';
      case 'warning':
        return 'bg-chart-4/20 text-chart-4';
      case 'success':
        return 'bg-chart-2/20 text-chart-2';
      case 'info':
      default:
        return 'bg-chart-1/20 text-chart-1';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'error':
        return '●';
      case 'warning':
        return '●';
      case 'success':
        return '●';
      case 'info':
      default:
        return '●';
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return timestamp;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-16 h-4 bg-muted rounded"></div>
                <div className="flex-1 h-4 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Logs</CardTitle>
        <p className="text-sm text-muted-foreground">Real-time activity feed</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No logs available
            </p>
          ) : (
            logs.map((log: SystemLog) => (
              <div key={log.id} className="flex items-start space-x-3 text-sm">
                <span className="text-xs text-muted-foreground whitespace-nowrap mt-1 font-mono">
                  {formatTime(log.createdAt)}
                </span>
                <div className="flex items-center space-x-2 flex-1">
                  <Badge variant="secondary" className={getLevelColor(log.level)}>
                    {getLevelIcon(log.level)}
                  </Badge>
                  <span className="text-foreground">{log.message}</span>
                  {log.category && (
                    <Badge variant="outline" className="text-xs">
                      {log.category}
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
          <Button variant="ghost" size="sm" data-testid="button-view-logs">
            View Full Logs
          </Button>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
              <span>Success</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-chart-4 rounded-full"></div>
              <span>Warning</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-destructive rounded-full"></div>
              <span>Error</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
