import Layout from "@/components/layout";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function ApiManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: endpoints = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/endpoints"],
  });

  const testEndpointMutation = useMutation({
    mutationFn: async (endpointId: string) => {
      return apiRequest("POST", `/api/endpoints/${endpointId}/test`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Endpoint test completed successfully",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to test endpoint",
        variant: "destructive",
      });
    },
  });

  const filteredEndpoints = endpoints.filter((endpoint: any) => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      endpoint.name.toLowerCase().includes(searchLower) ||
      endpoint.path.toLowerCase().includes(searchLower) ||
      endpoint.method.toLowerCase().includes(searchLower)
    );
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
        return 'bg-chart-2/20 text-chart-2';
      case 'warning':
        return 'bg-chart-4/20 text-chart-4';
      case 'error':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method?.toUpperCase()) {
      case 'GET':
        return 'bg-chart-2/20 text-chart-2';
      case 'POST':
        return 'bg-chart-1/20 text-chart-1';
      case 'PUT':
        return 'bg-chart-4/20 text-chart-4';
      case 'DELETE':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <Header 
          title="API Management" 
          subtitle="Monitor and manage API endpoints"
          onSearch={handleSearch}
        />
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header 
        title="API Management" 
        subtitle="Monitor and manage API endpoints"
        onSearch={handleSearch}
      />
      
      <main className="flex-1 overflow-auto p-6">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Endpoints</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-total-endpoints">
                    {endpoints.length}
                  </p>
                </div>
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Healthy</p>
                  <p className="text-2xl font-bold text-chart-2" data-testid="text-healthy-endpoints">
                    {endpoints.filter((e: any) => e.status === 'healthy').length}
                  </p>
                </div>
                <div className="w-3 h-3 bg-chart-2 rounded-full status-online"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Warning</p>
                  <p className="text-2xl font-bold text-chart-4" data-testid="text-warning-endpoints">
                    {endpoints.filter((e: any) => e.status === 'warning').length}
                  </p>
                </div>
                <div className="w-3 h-3 bg-chart-4 rounded-full status-warning"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Error</p>
                  <p className="text-2xl font-bold text-destructive" data-testid="text-error-endpoints">
                    {endpoints.filter((e: any) => e.status === 'error').length}
                  </p>
                </div>
                <div className="w-3 h-3 bg-destructive rounded-full status-error"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">API Endpoint Registry</h2>
                <p className="text-sm text-muted-foreground">
                  {filteredEndpoints.length} of {endpoints.length} endpoints
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" data-testid="button-refresh-all">
                  Refresh All
                </Button>
                <Button data-testid="button-add-endpoint">
                  Add Endpoint
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endpoints Table */}
        {filteredEndpoints.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchQuery ? "No Endpoints Found" : "No Endpoints Configured"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? `No endpoints match your search for "${searchQuery}"`
                  : "API endpoints will appear here once configured"
                }
              </p>
              {!searchQuery && (
                <Button data-testid="button-add-first-endpoint">
                  Add First Endpoint
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Endpoint Monitoring</CardTitle>
              <p className="text-sm text-muted-foreground">Real-time health checks and performance metrics</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Endpoint</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Method</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Response Time</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Uptime</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Check</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredEndpoints.map((endpoint: any) => (
                      <tr key={endpoint.id} className="hover:bg-accent/50 transition-colors">
                        <td className="py-3 px-4">
                          <div>
                            <code className="text-sm bg-muted px-2 py-1 rounded text-foreground">
                              {endpoint.path}
                            </code>
                            <p className="text-xs text-muted-foreground mt-1">{endpoint.name}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getMethodColor(endpoint.method)}>
                            {endpoint.method}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              endpoint.status === 'healthy' ? 'bg-chart-2 status-online' :
                              endpoint.status === 'warning' ? 'bg-chart-4 status-warning' :
                              endpoint.status === 'error' ? 'bg-destructive status-error' : 'bg-muted status-offline'
                            }`}></div>
                            <Badge className={getStatusColor(endpoint.status)}>
                              {endpoint.status}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {endpoint.responseTime ? `${endpoint.responseTime}ms` : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {endpoint.uptime ? `${endpoint.uptime}%` : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {endpoint.lastChecked 
                            ? new Date(endpoint.lastChecked).toLocaleString()
                            : 'Never'
                          }
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => testEndpointMutation.mutate(endpoint.id)}
                              disabled={testEndpointMutation.isPending}
                              data-testid={`button-test-${endpoint.id}`}
                            >
                              {testEndpointMutation.isPending ? 'Testing...' : 'Test'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              data-testid={`button-configure-${endpoint.id}`}
                            >
                              Configure
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Health Check Configuration */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Check Settings</CardTitle>
              <p className="text-sm text-muted-foreground">Configure monitoring parameters</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Check Interval</label>
                <Input
                  type="number"
                  placeholder="30"
                  className="mt-1"
                  data-testid="input-check-interval"
                />
                <p className="text-xs text-muted-foreground mt-1">Seconds between health checks</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Timeout</label>
                <Input
                  type="number"
                  placeholder="5000"
                  className="mt-1"
                  data-testid="input-timeout"
                />
                <p className="text-xs text-muted-foreground mt-1">Request timeout in milliseconds</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Retry Attempts</label>
                <Input
                  type="number"
                  placeholder="3"
                  className="mt-1"
                  data-testid="input-retry-attempts"
                />
                <p className="text-xs text-muted-foreground mt-1">Number of retry attempts on failure</p>
              </div>
              <Button className="w-full" data-testid="button-save-settings">
                Save Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">Set up notification preferences</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Webhook URL</label>
                <Input
                  type="url"
                  placeholder="https://hooks.slack.com/..."
                  className="mt-1"
                  data-testid="input-webhook-url"
                />
                <p className="text-xs text-muted-foreground mt-1">Slack/Discord webhook for alerts</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email Notifications</label>
                <Input
                  type="email"
                  placeholder="admin@scrollverse.com"
                  className="mt-1"
                  data-testid="input-alert-email"
                />
                <p className="text-xs text-muted-foreground mt-1">Email address for critical alerts</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Alert Threshold</label>
                <Input
                  type="number"
                  placeholder="5"
                  className="mt-1"
                  data-testid="input-alert-threshold"
                />
                <p className="text-xs text-muted-foreground mt-1">Consecutive failures before alert</p>
              </div>
              <Button className="w-full" data-testid="button-save-alerts">
                Save Alert Settings
              </Button>
            </CardContent>
          </Card>
        </div>

      </main>
    </Layout>
  );
}
