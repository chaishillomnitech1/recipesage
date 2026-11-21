import Layout from "@/components/layout";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import GuardianNftCard from "@/components/guardian-nft-card";

export default function Guardians() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: guardians = [], isLoading } = useQuery({
    queryKey: ["/api/guardians"],
  });

  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const filteredGuardians = guardians.filter((guardian: any) => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      guardian.tokenId.toString().includes(searchLower) ||
      guardian.ownerAddress.toLowerCase().includes(searchLower) ||
      guardian.tier?.name?.toLowerCase().includes(searchLower)
    );
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (isLoading) {
    return (
      <Layout>
        <Header 
          title="Guardian NFTs" 
          subtitle="Ceremonial NFT management and tracking"
          onSearch={handleSearch}
        />
        <main className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-8 bg-muted rounded"></div>
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
        title="Guardian NFTs" 
        subtitle="Ceremonial NFT management and tracking"
        onSearch={handleSearch}
      />
      
      <main className="flex-1 overflow-auto p-6">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Guardians</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-total-guardians">
                    {dashboardStats?.nfts?.total || 0}
                  </p>
                </div>
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Omni Tier</p>
                  <p className="text-2xl font-bold text-chart-1" data-testid="text-omni-count">
                    {dashboardStats?.nfts?.omni || 0}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-chart-1 to-chart-4 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">O</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gold Tier</p>
                  <p className="text-2xl font-bold text-chart-4" data-testid="text-gold-count">
                    {dashboardStats?.nfts?.gold || 0}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-chart-4 to-chart-5 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">G</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Silver & Bronze</p>
                  <p className="text-2xl font-bold text-chart-3" data-testid="text-silver-bronze-count">
                    {(dashboardStats?.nfts?.silver || 0) + (dashboardStats?.nfts?.bronze || 0)}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-chart-3 to-chart-5 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">S</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Guardian Collection</h2>
                <p className="text-sm text-muted-foreground">
                  {filteredGuardians.length} of {guardians.length} guardians
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" data-testid="button-export-guardians">
                  Export Data
                </Button>
                <Button data-testid="button-emergency-mint">
                  Emergency Mint
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guardian Grid */}
        {filteredGuardians.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchQuery ? "No Guardians Found" : "No Guardians Minted"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? `No guardians match your search for "${searchQuery}"`
                  : "Guardian NFTs will appear here once minted"
                }
              </p>
              {!searchQuery && (
                <Button data-testid="button-mint-first-guardian">
                  Mint First Guardian
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuardians.map((guardian: any) => (
              <GuardianNftCard
                key={guardian.id}
                tokenId={guardian.tokenId}
                tier={guardian.tier?.name || "Unknown"}
                ownerAddress={guardian.ownerAddress}
                mintedAt={guardian.mintedAt}
                transactionHash={guardian.transactionHash}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredGuardians.length > 0 && filteredGuardians.length === guardians.length && guardians.length >= 50 && (
          <div className="mt-8 text-center">
            <Button variant="outline" size="lg" data-testid="button-load-more">
              Load More Guardians
            </Button>
          </div>
        )}

      </main>
    </Layout>
  );
}
