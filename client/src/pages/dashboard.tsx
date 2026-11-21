import Layout from "@/components/layout";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useRealTime } from "@/hooks/useRealTime";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import MintTrendsChart from "@/components/charts/mint-trends-chart";
import PerformanceChart from "@/components/charts/performance-chart";
import GuardianNftCard from "@/components/guardian-nft-card";
import SystemLogs from "@/components/system-logs";
import CommandCenter from "@/components/command-center";

export default function Dashboard() {
  const { toast } = useToast();
  const { data: realTimeData, isConnected } = useRealTime();

  const { data: dashboardStats, refetch } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: recentNfts = [] } = useQuery({
    queryKey: ["/api/guardians", { limit: 5 }],
  });

  useEffect(() => {
    if (realTimeData?.metrics) {
      // Handle real-time metrics updates
      refetch();
    }
  }, [realTimeData, refetch]);

  const handleDeploy = () => {
    toast({
      title: "Deploy Initiated",
      description: "System updates deployment has been started",
    });
  };

  const handleCommandExecuted = () => {
    refetch();
  };

  if (!dashboardStats) {
    return (
      <Layout>
        <Header 
          title="Command Dashboard" 
          subtitle="Real-time system monitoring and control"
          showDeploy
          onDeploy={handleDeploy}
        />
        <main className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-8 bg-muted rounded mb-4"></div>
                  <div className="h-2 bg-muted rounded"></div>
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
        title="Command Dashboard" 
        subtitle="Real-time system monitoring and control"
        showDeploy
        onDeploy={handleDeploy}
      />
      
      <main className="flex-1 overflow-auto p-6">
        
        {/* Real-time connection status */}
        {!isConnected && (
          <div className="mb-4 p-3 bg-chart-4/20 border border-chart-4/30 rounded-lg">
            <p className="text-sm text-chart-4">
              ⚠️ Real-time connection lost. Attempting to reconnect...
            </p>
          </div>
        )}

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          
          {/* System Health */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">System Health</p>
                  <p className="text-2xl font-bold text-foreground">Operational</p>
                </div>
                <div className="w-3 h-3 bg-chart-2 rounded-full animate-pulse"></div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-chart-2 h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">98% uptime last 30 days</p>
              </div>
            </CardContent>
          </Card>

          {/* Guardian NFTs */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Guardian NFTs</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-nft-total">
                    {dashboardStats.nfts?.total || 0}
                  </p>
                </div>
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="mt-4 flex space-x-4 text-xs">
                <div className="text-center">
                  <p className="font-semibold text-chart-1" data-testid="text-nft-omni">
                    {dashboardStats.nfts?.omni || 0}
                  </p>
                  <p className="text-muted-foreground">Omni</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-chart-4" data-testid="text-nft-gold">
                    {dashboardStats.nfts?.gold || 0}
                  </p>
                  <p className="text-muted-foreground">Gold</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-chart-3" data-testid="text-nft-silver">
                    {dashboardStats.nfts?.silver || 0}
                  </p>
                  <p className="text-muted-foreground">Silver</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-chart-5" data-testid="text-nft-bronze">
                    {dashboardStats.nfts?.bronze || 0}
                  </p>
                  <p className="text-muted-foreground">Bronze</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Duels */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Duels</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-duels-active">
                    {dashboardStats.activeDuelsCount || 0}
                  </p>
                </div>
                <svg className="w-8 h-8 text-chart-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                </svg>
              </div>
              <p className="text-xs text-muted-foreground mt-4">Real-time battles</p>
            </CardContent>
          </Card>

          {/* PainCoin Value */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">PainCoin Value</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-paincoin-value">
                    {dashboardStats.painCoin?.totalSupply || "9.7T"}
                  </p>
                </div>
                <svg className="w-8 h-8 text-chart-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <span className="text-xs text-chart-2">↗</span>
                <span className="text-xs text-muted-foreground">Market cap growing</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Contract Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Recent Guardian Mints */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Guardian Mints</CardTitle>
              <p className="text-sm text-muted-foreground">Latest NFT ceremonial mints</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNfts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent mints available
                  </p>
                ) : (
                  recentNfts.slice(0, 3).map((nft: any) => (
                    <GuardianNftCard
                      key={nft.id}
                      tokenId={nft.tokenId}
                      tier={nft.tier?.name || "Unknown"}
                      ownerAddress={nft.ownerAddress}
                      mintedAt={nft.mintedAt}
                      transactionHash={nft.transactionHash}
                    />
                  ))
                )}
              </div>
              <Button variant="secondary" className="w-full mt-4" data-testid="button-view-mints">
                View All Mints
              </Button>
            </CardContent>
          </Card>

          {/* Contract Status */}
          <Card>
            <CardHeader>
              <CardTitle>Smart Contract Status</CardTitle>
              <p className="text-sm text-muted-foreground">Blockchain deployment monitoring</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardStats.contracts?.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No contracts deployed
                </p>
              ) : (
                dashboardStats.contracts?.map((contract: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        contract.status === 'active' ? 'bg-chart-2' : 
                        contract.status === 'deploying' ? 'bg-chart-4' : 'bg-muted'
                      }`}></div>
                      <span className="text-sm font-medium text-foreground">{contract.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={contract.status === 'active' ? 'default' : 'secondary'}>
                        {contract.status}
                      </Badge>
                      <Button variant="ghost" size="sm" data-testid={`button-view-contract-${index}`}>
                        View
                      </Button>
                    </div>
                  </div>
                ))
              )}
              
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Gas Price</span>
                  <span>23 Gwei</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Block Number</span>
                  <span>18,947,392</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Endpoints Monitoring */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>API Endpoint Monitoring</CardTitle>
            <p className="text-sm text-muted-foreground">Real-time health checks and performance metrics</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Endpoint</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Response Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Check</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dashboardStats.apiHealth?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-sm text-muted-foreground">
                        No API endpoints configured
                      </td>
                    </tr>
                  ) : (
                    dashboardStats.apiHealth?.map((endpoint: any, index: number) => (
                      <tr key={index}>
                        <td className="py-3 px-4">
                          <code className="text-sm bg-muted px-2 py-1 rounded text-foreground">
                            {endpoint.path}
                          </code>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={endpoint.status === 'healthy' ? 'default' : 'destructive'}>
                            {endpoint.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {endpoint.responseTime ? `${endpoint.responseTime}ms` : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {endpoint.lastChecked ? new Date(endpoint.lastChecked).toLocaleString() : 'Never'}
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm" data-testid={`button-test-endpoint-${index}`}>
                            Test
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Analytics and Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Mint Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Guardian Mint Trends</CardTitle>
              <p className="text-sm text-muted-foreground">Ceremonial NFT activity over time</p>
            </CardHeader>
            <CardContent>
              <MintTrendsChart />
            </CardContent>
          </Card>

          {/* System Performance */}
          <Card>
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
              <p className="text-sm text-muted-foreground">Infrastructure metrics and uptime</p>
            </CardHeader>
            <CardContent>
              <PerformanceChart 
                metrics={[
                  { 
                    label: "CPU Usage", 
                    value: dashboardStats.system?.cpu || 0, 
                    unit: "%", 
                    color: "hsl(217 91% 60%)" 
                  },
                  { 
                    label: "Memory Usage", 
                    value: dashboardStats.system?.memory || 0, 
                    unit: "%", 
                    color: "hsl(173 58% 39%)" 
                  },
                  { 
                    label: "Storage", 
                    value: dashboardStats.system?.storage || 0, 
                    unit: "%", 
                    color: "hsl(43 74% 66%)" 
                  },
                ]}
              />
            </CardContent>
          </Card>
        </div>

        {/* Command Center */}
        <div className="mb-8">
          <CommandCenter onCommandExecuted={handleCommandExecuted} />
        </div>

        {/* System Logs */}
        <SystemLogs limit={10} />

      </main>
    </Layout>
  );
}
