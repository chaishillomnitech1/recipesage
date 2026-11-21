import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GuardianNftCardProps {
  tokenId: number;
  tier: string;
  ownerAddress: string;
  mintedAt: string;
  transactionHash?: string;
}

export default function GuardianNftCard({
  tokenId,
  tier,
  ownerAddress,
  mintedAt,
  transactionHash
}: GuardianNftCardProps) {
  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'omni':
        return 'from-chart-1 to-chart-4';
      case 'gold':
        return 'from-chart-4 to-chart-5';
      case 'silver':
        return 'from-chart-3 to-chart-2';
      case 'bronze':
        return 'from-chart-5 to-chart-3';
      default:
        return 'from-chart-1 to-chart-2';
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'omni':
        return 'bg-chart-1/20 text-chart-1';
      case 'gold':
        return 'bg-chart-4/20 text-chart-4';
      case 'silver':
        return 'bg-chart-3/20 text-chart-3';
      case 'bronze':
        return 'bg-chart-5/20 text-chart-5';
      default:
        return 'bg-primary/20 text-primary';
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return date;
    }
  };

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getTierColor(tier)} flex items-center justify-center`}>
              <span className="text-xs font-bold text-primary-foreground">G</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Guardian #{tokenId}</p>
              <Badge 
                variant="secondary" 
                className={getTierBadgeColor(tier)}
              >
                {tier} Tier
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground" data-testid={`text-address-${tokenId}`}>
              {formatAddress(ownerAddress)}
            </p>
            <p className="text-xs text-muted-foreground" data-testid={`text-time-${tokenId}`}>
              {formatDate(mintedAt)}
            </p>
            {transactionHash && (
              <a 
                href={`https://etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:text-primary/80"
                data-testid={`link-tx-${tokenId}`}
              >
                View TX
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
