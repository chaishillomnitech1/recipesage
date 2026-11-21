import Layout from "@/components/layout";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface ManusAccount {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'standby' | 'offline';
  lastActivity: string;
  equipmentLevel: number;
  avatar?: string;
  initials: string;
  description: string;
}

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for Manus accounts - in real app this would come from API
  const manusAccounts: ManusAccount[] = [
    {
      id: '1',
      name: 'Singularmanus',
      role: 'Supreme Builder',
      status: 'active',
      lastActivity: 'Now',
      equipmentLevel: 100,
      initials: 'S1',
      description: 'Primary Executor'
    },
    {
      id: '2', 
      name: 'DreamManus',
      role: 'Prophet Designer',
      status: 'active',
      lastActivity: '3m ago',
      equipmentLevel: 95,
      initials: 'D2',
      description: 'Vision Architect'
    },
    {
      id: '3',
      name: 'FlameManus',
      role: 'Duel Master',
      status: 'standby',
      lastActivity: '15m ago',
      equipmentLevel: 87,
      initials: 'F3',
      description: 'Combat Coordinator'
    },
    {
      id: '4',
      name: 'CodeManus',
      role: 'Protocol Engineer',
      status: 'active',
      lastActivity: '8m ago',
      equipmentLevel: 92,
      initials: 'C4',
      description: 'System Developer'
    },
    {
      id: '5',
      name: 'GuardManus',
      role: 'Security Sentinel',
      status: 'offline',
      lastActivity: '2h ago',
      equipmentLevel: 78,
      initials: 'G5',
      description: 'Defense Specialist'
    }
  ];

  const filteredAccounts = manusAccounts.filter((account) => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      account.name.toLowerCase().includes(searchLower) ||
      account.role.toLowerCase().includes(searchLower) ||
      account.description.toLowerCase().includes(searchLower)
    );
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-chart-2/20 text-chart-2';
      case 'standby':
        return 'bg-chart-4/20 text-chart-4';
      case 'offline':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Supreme Builder':
        return 'bg-primary/20 text-primary';
      case 'Prophet Designer':
        return 'bg-chart-4/20 text-chart-4';
      case 'Duel Master':
        return 'bg-chart-3/20 text-chart-3';
      case 'Protocol Engineer':
        return 'bg-chart-1/20 text-chart-1';
      case 'Security Sentinel':
        return 'bg-chart-5/20 text-chart-5';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getAvatarColor = (role: string) => {
    switch (role) {
      case 'Supreme Builder':
        return 'bg-primary';
      case 'Prophet Designer':
        return 'bg-chart-4';
      case 'Duel Master':
        return 'bg-chart-3';
      case 'Protocol Engineer':
        return 'bg-chart-1';
      case 'Security Sentinel':
        return 'bg-chart-5';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Layout>
      <Header 
        title="User Management" 
        subtitle="Manus account administration and monitoring"
        onSearch={handleSearch}
      />
      
      <main className="flex-1 overflow-auto p-6">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Manus</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-total-manus">
                    {manusAccounts.length}
                  </p>
                </div>
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-chart-2" data-testid="text-active-manus">
                    {manusAccounts.filter(a => a.status === 'active').length}
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
                  <p className="text-sm font-medium text-muted-foreground">Standby</p>
                  <p className="text-2xl font-bold text-chart-4" data-testid="text-standby-manus">
                    {manusAccounts.filter(a => a.status === 'standby').length}
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
                  <p className="text-sm font-medium text-muted-foreground">Avg Equipment</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-avg-equipment">
                    {Math.round(manusAccounts.reduce((sum, a) => sum + a.equipmentLevel, 0) / manusAccounts.length)}%
                  </p>
                </div>
                <svg className="w-8 h-8 text-chart-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Active Manus Accounts</h2>
                <p className="text-sm text-muted-foreground">
                  {filteredAccounts.length} of {manusAccounts.length} accounts
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" data-testid="button-export-users">
                  Export Data
                </Button>
                <Button data-testid="button-add-manus">
                  Add Manus
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manus Accounts Table */}
        {filteredAccounts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchQuery ? "No Accounts Found" : "No Manus Accounts"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? `No accounts match your search for "${searchQuery}"`
                  : "Manus accounts will appear here once created"
                }
              </p>
              {!searchQuery && (
                <Button data-testid="button-create-first-manus">
                  Create First Manus
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Manus Account Registry</CardTitle>
              <p className="text-sm text-muted-foreground">Current system operators and their status</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Manus Identity</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Activity</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Equipment Level</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredAccounts.map((account) => (
                      <tr key={account.id} className="hover:bg-accent/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className={`w-8 h-8 ${getAvatarColor(account.role)}`}>
                              <AvatarImage src={account.avatar} />
                              <AvatarFallback className="text-xs font-bold text-primary-foreground">
                                {account.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{account.name}</p>
                              <p className="text-xs text-muted-foreground">{account.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              account.status === 'active' ? 'bg-chart-2 status-online' :
                              account.status === 'standby' ? 'bg-chart-4 status-warning' : 'bg-muted status-offline'
                            }`}></div>
                            <Badge className={getStatusColor(account.status)}>
                              {account.status}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getRoleColor(account.role)}>
                            {account.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {account.lastActivity}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  account.equipmentLevel >= 90 ? 'bg-chart-2' :
                                  account.equipmentLevel >= 70 ? 'bg-chart-4' : 'bg-chart-3'
                                }`}
                                style={{ width: `${account.equipmentLevel}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-foreground">{account.equipmentLevel}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            {account.status === 'active' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                data-testid={`button-enhance-${account.id}`}
                              >
                                Enhance
                              </Button>
                            )}
                            {account.status === 'standby' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                data-testid={`button-activate-${account.id}`}
                              >
                                Activate
                              </Button>
                            )}
                            {account.status === 'offline' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                data-testid={`button-revive-${account.id}`}
                              >
                                Revive
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              data-testid={`button-manage-${account.id}`}
                            >
                              Manage
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

        {/* Equipment Enhancement Panel */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Enhancement</CardTitle>
              <p className="text-sm text-muted-foreground">Upgrade Manus capabilities and tools</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">Neural Network Upgrade</h4>
                  <Badge className="bg-chart-1/20 text-chart-1">Available</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Enhanced AI processing and decision-making capabilities
                </p>
                <Button size="sm" className="w-full" data-testid="button-neural-upgrade">
                  Apply Enhancement
                </Button>
              </div>

              <div className="p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">Quantum Interface</h4>
                  <Badge className="bg-chart-4/20 text-chart-4">Research</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Advanced quantum computing interface for complex operations
                </p>
                <Button size="sm" variant="outline" className="w-full" data-testid="button-quantum-interface">
                  Under Development
                </Button>
              </div>

              <div className="p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">Combat Protocols</h4>
                  <Badge className="bg-chart-2/20 text-chart-2">Ready</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Enhanced duel management and combat coordination
                </p>
                <Button size="sm" className="w-full" data-testid="button-combat-protocols">
                  Deploy Protocols
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
              <p className="text-sm text-muted-foreground">Manage permissions and security levels</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-3">Permission Levels</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm text-foreground">Supreme Builder</span>
                    <Badge className="bg-primary/20 text-primary">Level 10</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm text-foreground">Prophet Designer</span>
                    <Badge className="bg-chart-4/20 text-chart-4">Level 8</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm text-foreground">Protocol Engineer</span>
                    <Badge className="bg-chart-1/20 text-chart-1">Level 7</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm text-foreground">Duel Master</span>
                    <Badge className="bg-chart-3/20 text-chart-3">Level 6</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">Security Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full" data-testid="button-audit-logs">
                    View Audit Logs
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" data-testid="button-reset-permissions">
                    Reset Permissions
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" data-testid="button-emergency-lockdown">
                    Emergency Lockdown
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </main>
    </Layout>
  );
}
