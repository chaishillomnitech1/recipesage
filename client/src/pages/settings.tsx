import Layout from "@/components/layout";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Settings() {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your configuration has been updated successfully",
    });
  };

  const handleExportConfig = () => {
    toast({
      title: "Configuration Exported",
      description: "System configuration has been exported to file",
    });
  };

  const handleSystemReset = () => {
    toast({
      title: "System Reset Initiated",
      description: "System will restart with default configuration",
      variant: "destructive",
    });
  };

  return (
    <Layout>
      <Header 
        title="System Settings" 
        subtitle="Configure ScrollVerse Command Hub preferences"
      />
      
      <main className="flex-1 overflow-auto p-6">
        
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <p className="text-sm text-muted-foreground">Basic system configuration and preferences</p>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="system-name">System Name</Label>
                  <Input 
                    id="system-name" 
                    defaultValue="ScrollVerse Command Hub"
                    data-testid="input-system-name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Administrator Email</Label>
                  <Input 
                    id="admin-email" 
                    type="email"
                    defaultValue="admin@scrollverse.com"
                    data-testid="input-admin-email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger data-testid="select-timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                      <SelectItem value="gmt">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger data-testid="select-language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Use dark theme across the interface</p>
                  </div>
                  <Switch 
                    checked={isDarkMode} 
                    onCheckedChange={setIsDarkMode}
                    data-testid="switch-dark-mode"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Real-time Updates</Label>
                    <p className="text-sm text-muted-foreground">Enable live data updates via WebSocket</p>
                  </div>
                  <Switch 
                    checked={realTimeUpdates} 
                    onCheckedChange={setRealTimeUpdates}
                    data-testid="switch-realtime-updates"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive system alerts and notifications</p>
                  </div>
                  <Switch 
                    checked={notifications} 
                    onCheckedChange={setNotifications}
                    data-testid="switch-notifications"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">Authentication and access control settings</p>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input 
                    id="session-timeout" 
                    type="number"
                    defaultValue="120"
                    data-testid="input-session-timeout"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                  <Input 
                    id="max-login-attempts" 
                    type="number"
                    defaultValue="5"
                    data-testid="input-max-login-attempts"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowed-domains">Allowed Domains</Label>
                <Textarea 
                  id="allowed-domains"
                  placeholder="domain1.com, domain2.com"
                  className="min-h-[100px]"
                  data-testid="textarea-allowed-domains"
                />
                <p className="text-xs text-muted-foreground">Comma-separated list of allowed domains</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin access</p>
                  </div>
                  <Switch data-testid="switch-2fa" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>IP Whitelist</Label>
                    <p className="text-sm text-muted-foreground">Restrict access to whitelisted IPs only</p>
                  </div>
                  <Switch data-testid="switch-ip-whitelist" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Database & Backup */}
          <Card>
            <CardHeader>
              <CardTitle>Database & Backup</CardTitle>
              <p className="text-sm text-muted-foreground">Data management and backup configuration</p>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="backup-interval">Backup Interval (hours)</Label>
                  <Input 
                    id="backup-interval" 
                    type="number"
                    defaultValue="24"
                    data-testid="input-backup-interval"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backup-retention">Retention Period (days)</Label>
                  <Input 
                    id="backup-retention" 
                    type="number"
                    defaultValue="30"
                    data-testid="input-backup-retention"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-location">Backup Storage Location</Label>
                <Input 
                  id="backup-location"
                  defaultValue="s3://scrollverse-backups/"
                  data-testid="input-backup-location"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">Enable scheduled database backups</p>
                  </div>
                  <Switch 
                    checked={autoBackup} 
                    onCheckedChange={setAutoBackup}
                    data-testid="switch-auto-backup"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Backup Encryption</Label>
                    <p className="text-sm text-muted-foreground">Encrypt backup files with AES-256</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-backup-encryption" />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" data-testid="button-backup-now">
                  Backup Now
                </Button>
                <Button variant="outline" data-testid="button-restore-backup">
                  Restore from Backup
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">API endpoints and integration settings</p>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="rate-limit">Rate Limit (requests/minute)</Label>
                  <Input 
                    id="rate-limit" 
                    type="number"
                    defaultValue="1000"
                    data-testid="input-rate-limit"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api-timeout">API Timeout (seconds)</Label>
                  <Input 
                    id="api-timeout" 
                    type="number"
                    defaultValue="30"
                    data-testid="input-api-timeout"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input 
                  id="webhook-url"
                  placeholder="https://api.scrollverse.com/webhooks"
                  data-testid="input-webhook-url"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="api-key"
                    type="password"
                    defaultValue="••••••••••••••••"
                    className="flex-1"
                    data-testid="input-api-key"
                  />
                  <Button variant="outline" data-testid="button-regenerate-key">
                    Regenerate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle>System Monitoring</CardTitle>
              <p className="text-sm text-muted-foreground">Performance monitoring and alerting</p>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cpu-threshold">CPU Alert Threshold (%)</Label>
                  <Input 
                    id="cpu-threshold" 
                    type="number"
                    defaultValue="80"
                    data-testid="input-cpu-threshold"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="memory-threshold">Memory Alert Threshold (%)</Label>
                  <Input 
                    id="memory-threshold" 
                    type="number"
                    defaultValue="85"
                    data-testid="input-memory-threshold"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="disk-threshold">Disk Alert Threshold (%)</Label>
                  <Input 
                    id="disk-threshold" 
                    type="number"
                    defaultValue="90"
                    data-testid="input-disk-threshold"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Performance Monitoring</Label>
                    <p className="text-sm text-muted-foreground">Monitor system performance metrics</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-performance-monitoring" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Error Logging</Label>
                    <p className="text-sm text-muted-foreground">Log system errors and exceptions</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-error-logging" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Health Check Alerts</Label>
                    <p className="text-sm text-muted-foreground">Send alerts when services are unhealthy</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-health-alerts" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
            <Button 
              onClick={handleSaveSettings}
              className="flex-1"
              data-testid="button-save-settings"
            >
              Save All Settings
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExportConfig}
              data-testid="button-export-config"
            >
              Export Configuration
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleSystemReset}
              data-testid="button-system-reset"
            >
              Reset to Defaults
            </Button>
          </div>

        </div>

      </main>
    </Layout>
  );
}
