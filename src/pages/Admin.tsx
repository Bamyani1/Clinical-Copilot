import { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Database, Shield, BarChart3, ArrowLeft, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Disclaimer } from "@/components/ui/disclaimer";
import { useSettingsStore } from "@/lib/store";

export default function Admin() {
  const {
    localOnlyMode,
    sttProvider,
    llmProvider,
    setLocalOnlyMode,
    setSttProvider,
    setLlmProvider,
  } = useSettingsStore();

  const [showDangerZone, setShowDangerZone] = useState(false);

  const systemStatus = {
    database: "Connected",
    sttService: sttProvider === 'mock' ? "Mock (Development)" : "Connected",
    llmService: llmProvider === 'mock' ? "Mock (Development)" : "Connected",
    lastBackup: "2024-01-15 14:30:00",
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Database Connection</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-success text-success-foreground">
                      {systemStatus.database}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">STT Service</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant={sttProvider === 'mock' ? 'secondary' : 'default'}>
                      {systemStatus.sttService}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">LLM Service</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant={llmProvider === 'mock' ? 'secondary' : 'default'}>
                      {systemStatus.llmService}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Last Backup</Label>
                  <div className="text-sm text-muted-foreground">
                    {systemStatus.lastBackup}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Provider Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Provider Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="stt-provider">Speech-to-Text Provider</Label>
                <Select value={sttProvider} onValueChange={setSttProvider}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mock">Mock (Development)</SelectItem>
                    <SelectItem value="whisper" disabled>OpenAI Whisper (Coming Soon)</SelectItem>
                    <SelectItem value="gcp" disabled>Google Cloud Speech (Coming Soon)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Controls the speech-to-text transcription service.
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="llm-provider">LLM Provider</Label>
                <Select value={llmProvider} onValueChange={setLlmProvider}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mock">Mock (Development)</SelectItem>
                    <SelectItem value="openai" disabled>OpenAI GPT (Coming Soon)</SelectItem>
                    <SelectItem value="anthropic" disabled>Anthropic Claude (Coming Soon)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Controls the AI reasoning and clinical decision support.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Local-Only Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    When enabled, all data stays on device with no cloud transmission.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocalOnlyMode(!localOnlyMode)}
                  className="p-1"
                >
                  {localOnlyMode ? (
                    <ToggleRight className="h-6 w-6 text-success" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                  )}
                </Button>
              </div>

              {localOnlyMode && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Local-only mode is active. All patient data remains on this device, and some features are limited
                    while it is enabled.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* System Maintenance */}
          <Card>
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" disabled>
                  Export System Logs
                </Button>
                <Button variant="outline" disabled>
                  Run Database Backup
                </Button>
                <Button variant="outline" disabled>
                  Clear Cached Data
                </Button>
                <Button variant="outline" disabled>
                  Update Guidelines
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                onClick={() => setShowDangerZone(!showDangerZone)}
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                {showDangerZone ? "Hide danger zone" : "Show danger zone"}
              </Button>
              
              {showDangerZone && (
                <div className="space-y-2 p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                  <Alert variant="destructive">
                    <AlertDescription>
                      These actions are irreversible and should only be performed by system administrators.
                    </AlertDescription>
                  </Alert>
                  <div className="grid md:grid-cols-2 gap-2">
                    <Button variant="destructive" size="sm" disabled>
                      Reset All Settings
                    </Button>
                    <Button variant="destructive" size="sm" disabled>
                      Purge All Data
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Disclaimer />
        </div>
      </main>
    </div>
  );
}
