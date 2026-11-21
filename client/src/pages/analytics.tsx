import Layout from "@/components/layout";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MintTrendsChart from "@/components/charts/mint-trends-chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("7d");

  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: systemMetrics = [] } = useQuery({
    queryKey: ["/api/metrics", { timeRange }],
  });

  // Mock data for charts - in real app this would come from API
  const tierDistribution = [
    { name: 'Omni', value: dashboardStats?.nfts?.omni || 0, color: 'hsl(217, 91%, 60%)' },
    { name: 'Gold', value: dashboardStats?.nfts?.gold || 0, color: 'hsl(43, 74%, 66%)' },
    { name: 'Silver', value: dashboardStats?.nfts?.silver || 0, color: 'hsl(197, 37%, 24%)' },
    { name: 'Bronze', value: dashboardStats?.nfts?.bronze || 0, color: 'hsl(27, 87%, 67%)' },
  ];

  const mintingActivity = [
    { date: '2024-01-01', mints: 12 },
    { date: '2024-01-02', mints: 19 },
    { date: '2024-01-03', mints: 8 },
    { date: '2024-01-04', mints: 23 },
    { date: '2024-01-05', mints: 15 },
    { date: '2024-01-06', mints: 31 },
    { date: '2024-01-07', mints: 28 },
  ];

  const performanceMetrics = [
    { metric: 'CPU', current: dashboardStats?.system?.cpu || 0, previous: 45 },
    { metric: 'Memory', current: dashboardStats?.system?.memory || 0, previous: 38 },
    { metric: 'Storage', current: dashboardStats?.system?.storage || 0, previous: 25 },
    { metric: 'Network', current: 78, previous: 82 },
  ];

  const userGrowth = [
    { month: 'Jan', users: 1200 },
    { month: 'Feb', users: 1450 },
    { month: 'Mar', users: 1680 },
    { month: 'Apr', users: 1920 },
    { month: 'May', users: 2150 },
    { month: 'Jun', users: 2480 },
    { month: 'Jul', users: 2750 },
  ];

  return (
    <Layout>
      <Header 
        title="Analytics Dashboard" 
        subtitle="Data insights and performance metrics"
      />
      
      <main className="flex-1 overflow-auto p-6">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Analytics Overview</h2>
            <p className="text-sm text-muted-foreground">
              Comprehensive insights into system performance and user activity
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32" data-testid="select-time-range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last Day</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" data-testid="button-export-analytics">
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-total-revenue">
                    {dashboardStats?.painCoin?.marketCap || "9.7T"} PC
                  </p>
                </div>
                <div className="text-chart-2">
                  <span className="text-xs">↗ +24.7%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-active-users">
                    2,750
                  </p>
                </div>
                <div className="text-chart-2">
                  <span className="text-xs">↗ +11.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-avg-response">
                    247ms
                  </p>
                </div>
                <div className="text-chart-2">
                  <span className="text-xs">↘ -8.3%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-uptime">
                    99.97%
                  </p>
                </div>
                <div className="text-chart-2">
                  <span className="text-xs">↗ +0.02%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Guardian Tier Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Guardian Tier Distribution</CardTitle>
              <p className="text-sm text-muted-foreground">NFT distribution across tiers</p>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tierDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {tierDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                {tierDistribution.map((tier, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: tier.color }}
                    ></div>
                    <span className="text-sm text-muted-foreground">
                      {tier.name} ({tier.value})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>System Performance Comparison</CardTitle>
              <p className="text-sm text-muted-foreground">Current vs previous period</p>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 17%)" />
                    <XAxis 
                      dataKey="metric" 
                      stroke="hsl(215 20% 65%)"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(215 20% 65%)"
                      fontSize={12}
                    />
                    <Bar dataKey="current" fill="hsl(217 91% 60%)" name="Current" />
                    <Bar dataKey="previous" fill="hsl(173 58% 39%)" name="Previous" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Time Series Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Minting Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Minting Activity</CardTitle>
              <p className="text-sm text-muted-foreground">Guardian NFT mints over time</p>
            </CardHeader>
            <CardContent>
              <MintTrendsChart data={mintingActivity} />
            </CardContent>
          </Card>

          {/* User Growth */}
          <Card>
            <CardHeader>
              <CardTitle>User Growth Trend</CardTitle>
              <p className="text-sm text-muted-foreground">Total active users over time</p>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowth}>
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
                      dataKey="users" 
                      stroke="hsl(173 58% 39%)"
                      strokeWidth={3}
                      dot={{ fill: "hsl(173 58% 39%)", strokeWidth: 2, r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Endpoints</CardTitle>
              <p className="text-sm text-muted-foreground">Best response times and uptime</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div>
                    <code className="text-sm font-mono">/api/ignite</code>
                    <p className="text-xs text-muted-foreground">Guardian minting</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-chart-2">156ms</p>
                    <p className="text-xs text-muted-foreground">99.9% uptime</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div>
                    <code className="text-sm font-mono">/api/verify</code>
                    <p className="text-xs text-muted-foreground">Authentication</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-chart-2">189ms</p>
                    <p className="text-xs text-muted-foreground">99.8% uptime</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div>
                    <code className="text-sm font-mono">/api/guardians</code>
                    <p className="text-xs text-muted-foreground">NFT queries</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-chart-2">234ms</p>
                    <p className="text-xs text-muted-foreground">99.7% uptime</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Error Analysis</CardTitle>
              <p className="text-sm text-muted-foreground">Most common issues and failures</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">Timeout Errors</p>
                    <p className="text-xs text-muted-foreground">Request timeouts</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-destructive">23</p>
                    <p className="text-xs text-muted-foreground">Last 24h</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-chart-4/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">Rate Limit</p>
                    <p className="text-xs text-muted-foreground">429 responses</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-chart-4">12</p>
                    <p className="text-xs text-muted-foreground">Last 24h</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-chart-4/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">Server Errors</p>
                    <p className="text-xs text-muted-foreground">5xx responses</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-chart-4">8</p>
                    <p className="text-xs text-muted-foreground">Last 24h</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </main>
    </Layout>
  );
}
