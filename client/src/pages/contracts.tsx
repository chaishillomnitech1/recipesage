import Layout from "@/components/layout";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

export default function Contracts() {
  const { data: contracts = [], isLoading } = useQuery({
    queryKey: ["/api/contracts"],
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-chart-2/20 text-chart-2';
      case 'deploying':
        return 'bg-chart-4/20 text-chart-4';
      case 'failed':
        return 'bg-destructive/20 text-destructive';
      case 'pending':
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '●';
      case 'deploying':
        return '⟳';
      case 'failed':
        return '✕';
      case 'pending':
      default:
        return '○';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <Header 
          title="Smart Contracts" 
          subtitle="Blockchain deployment management"
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
        title="Smart Contracts" 
        subtitle="Blockchain deployment management"
      />
      
      <main className="flex-1 overflow-auto p-6">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Contracts</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-total-contracts">
                    {contracts.length}
                  </p>
                </div>
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-chart-2" data-testid="text-active-contracts">
                    {contracts.filter((c: any) => c.status === 'active').length}
                  </p>
                </div>
                <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Deploying</p>
                  <p className="text-2xl font-bold text-chart-4" data-testid="text-deploying-contracts">
                    {contracts.filter((c: any) => c.status === 'deploying').length}
                  </p>
                </div>
                <div className="w-3 h-3 bg-chart-4 rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Failed</p>
                  <p className="text-2xl font-bold text-destructive" data-testid="text-failed-contracts">
                    {contracts.filter((c: any) => c.status === 'failed').length}
                  </p>
                </div>
                <div className="w-3 h-3 bg-destructive rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Smart Contract Registry</h2>
                <p className="text-sm text-muted-foreground">
                  Manage and monitor blockchain contract deployments
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" data-testid="button-import-contract">
                  Import Contract
                </Button>
                <Button data-testid="button-deploy-new">
                  Deploy New Contract
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contracts List */}
        {contracts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Contracts Deployed</h3>
              <p className="text-muted-foreground mb-4">
                Smart contracts will appear here once deployed to the blockchain
              </p>
              <Button data-testid="button-deploy-first">
                Deploy First Contract
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {contracts.map((contract: any) => (
              <Card key={contract.id} className="hover:bg-accent/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        contract.status === 'active' ? 'bg-chart-2' :
                        contract.status === 'deploying' ? 'bg-chart-4 animate-pulse' :
                        contract.status === 'failed' ? 'bg-destructive' : 'bg-muted'
                      }`}></div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{contract.name}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          {contract.contractAddress && (
                            <code className="text-sm bg-muted px-2 py-1 rounded text-foreground">
                              {contract.contractAddress.slice(0, 10)}...{contract.contractAddress.slice(-8)}
                            </code>
                          )}
                          <span className="text-sm text-muted-foreground">
                            Network: {contract.networkId === 1 ? 'Mainnet' : 'Testnet'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(contract.status)}>
                        {getStatusIcon(contract.status)} {contract.status}
                      </Badge>
                      
                      <div className="flex space-x-2">
                        {contract.contractAddress && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            data-testid={`button-view-contract-${contract.id}`}
                          >
                            View on Etherscan
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          data-testid={`button-manage-contract-${contract.id}`}
                        >
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contract Details */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Deployed</p>
                        <p className="font-medium text-foreground">
                          {new Date(contract.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Gas Used</p>
                        <p className="font-medium text-foreground">
                          {contract.gasUsed || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Deployer</p>
                        <p className="font-medium text-foreground">
                          {contract.deployedBy || 'System'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Updated</p>
                        <p className="font-medium text-foreground">
                          {new Date(contract.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </main>
    </Layout>
  );
}
