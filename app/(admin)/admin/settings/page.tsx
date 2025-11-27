"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [platformPaused, setPlatformPaused] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [announcementMessage, setAnnouncementMessage] = useState("");

  const settings = useQuery(api.appSettings.getAppSettings);
  const updateSettingsMutation = useMutation(api.appSettings.updateAppSettings);

  useEffect(() => {
    if (settings) {
      setPlatformPaused(settings.platformPaused);
      setMaintenanceMode(settings.maintenanceMode);
      setAnnouncementMessage((settings as any).announcementMessage || "");
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettingsMutation({
        platformPaused,
        maintenanceMode,
        announcementMessage: announcementMessage || undefined,
      });
      alert("Settings saved successfully");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save settings");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Platform Settings</h1>
        <p className="text-muted-foreground">
          Configure platform-wide settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Control</CardTitle>
          <CardDescription>
            Control platform availability and maintenance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Platform Paused</Label>
              <p className="text-sm text-muted-foreground">
                Temporarily pause all platform operations
              </p>
            </div>
            <Switch
              checked={platformPaused}
              onCheckedChange={setPlatformPaused}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable maintenance mode (users see maintenance message)
              </p>
            </div>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
            />
          </div>

          <div className="space-y-2">
            <Label>Announcement Message</Label>
            <Textarea
              placeholder="Platform-wide announcement message..."
              value={announcementMessage}
              onChange={(e) => setAnnouncementMessage(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              This message will be displayed to all users
            </p>
          </div>

          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Staking Configuration</CardTitle>
          <CardDescription>
            Configure staking options and ROI percentages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Staking options can be configured here. Current options:
          </p>
          {settings?.stakingOptions && (
            <div className="mt-4 space-y-2">
              {settings.stakingOptions.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <span className="font-medium">{option.duration} days</span>
                  <span className="text-muted-foreground">{option.roiPercentage}% ROI</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supported Coins</CardTitle>
          <CardDescription>
            Manage supported cryptocurrencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {settings?.supportedCoins?.length || 0} coins currently supported
          </p>
          {settings?.supportedCoins && (
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {settings.supportedCoins.map((coin, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <span className="font-medium">{coin.symbol}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {coin.name}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {coin.depositEnabled && (
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded">
                        Deposits
                      </span>
                    )}
                    {coin.withdrawalEnabled && (
                      <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded">
                        Withdrawals
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

