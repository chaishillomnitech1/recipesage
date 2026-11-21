import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            ScrollVerse
          </h1>
          <p className="text-xl text-muted-foreground mb-2">Command Hub</p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive central hub for managing and tracking all aspects of the blockchain-based Guardian NFT ecosystem with real-time monitoring and admin capabilities.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-chart-1 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Guardian NFTs</h3>
                <p className="text-sm text-muted-foreground">Monitor and manage ceremonial NFT mints across all tiers</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-chart-2 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Real-time Analytics</h3>
                <p className="text-sm text-muted-foreground">Live monitoring of system performance and metrics</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-chart-4 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Command Center</h3>
                <p className="text-sm text-muted-foreground">Execute system commands and manage deployments</p>
              </div>
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-3"
                onClick={() => window.location.href = '/api/login'}
                data-testid="button-login"
              >
                Access Command Hub
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Secure authentication required for system access
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>© 2025 ScrollVerse Command Hub. All systems operational.</p>
        </div>
      </div>
    </div>
  );
}
