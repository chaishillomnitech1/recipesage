import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CommandCenterProps {
  onCommandExecuted?: () => void;
}

export default function CommandCenter({ onCommandExecuted }: CommandCenterProps) {
  const { toast } = useToast();

  const emergencyMintMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/commands/emergency-mint"),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Emergency mint initiated successfully",
      });
      onCommandExecuted?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to initiate emergency mint",
        variant: "destructive",
      });
    },
  });

  const deployContractsMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/commands/deploy-contracts"),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Contract deployment initiated successfully",
      });
      onCommandExecuted?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to initiate contract deployment",
        variant: "destructive",
      });
    },
  });

  const systemBackupMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/commands/system-backup"),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "System backup initiated successfully",
      });
      onCommandExecuted?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to initiate system backup",
        variant: "destructive",
      });
    },
  });

  const painCoinAirdropMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/commands/paincoin-airdrop"),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "PainCoin airdrop initiated successfully",
      });
      onCommandExecuted?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to initiate PainCoin airdrop",
        variant: "destructive",
      });
    },
  });

  const commands = [
    {
      title: "Emergency Mint",
      description: "Mint Guardian NFT directly",
      icon: (
        <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
      ),
      className: "bg-primary text-primary-foreground hover:bg-primary/90",
      mutation: emergencyMintMutation,
      testId: "button-emergency-mint"
    },
    {
      title: "Deploy Contracts",
      description: "Push to blockchain",
      icon: (
        <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
        </svg>
      ),
      className: "bg-chart-4 text-primary-foreground hover:bg-chart-4/90",
      mutation: deployContractsMutation,
      testId: "button-deploy-contracts"
    },
    {
      title: "System Backup",
      description: "Archive to ScrollChain",
      icon: (
        <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
      ),
      className: "bg-chart-2 text-primary-foreground hover:bg-chart-2/90",
      mutation: systemBackupMutation,
      testId: "button-system-backup"
    },
    {
      title: "PainCoin Airdrop",
      description: "Distribute to loyal souls",
      icon: (
        <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
        </svg>
      ),
      className: "bg-chart-5 text-primary-foreground hover:bg-chart-5/90",
      mutation: painCoinAirdropMutation,
      testId: "button-paincoin-airdrop"
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Command Center</CardTitle>
        <p className="text-sm text-muted-foreground">Quick actions and system commands</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {commands.map((command, index) => (
            <Button
              key={index}
              onClick={() => command.mutation.mutate()}
              disabled={command.mutation.isPending}
              className={`p-4 rounded-lg transition-colors text-left h-auto flex flex-col items-start ${command.className}`}
              data-testid={command.testId}
            >
              {command.icon}
              <p className="font-semibold mb-1">{command.title}</p>
              <p className="text-xs opacity-90">{command.description}</p>
              {command.mutation.isPending && (
                <div className="mt-2 text-xs opacity-75">Processing...</div>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
