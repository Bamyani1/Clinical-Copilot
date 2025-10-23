import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, User, UserCheck, Edit2, Save, X } from "lucide-react";
import { useVisitStore, TranscriptEntry } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

export function TranscriptViewer() {
  const { transcript } = useVisitStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const startEdit = (entry: TranscriptEntry) => {
    setEditingId(entry.id);
    setEditText(entry.text);
  };

  const saveEdit = () => {
    // In a real app, this would update the transcript entry
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getSpeakerColor = (speaker: 'doctor' | 'patient') => {
    return speaker === 'doctor' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground';
  };

  const getSpeakerIcon = (speaker: 'doctor' | 'patient') => {
    return speaker === 'doctor' ? <UserCheck className="h-4 w-4" /> : <User className="h-4 w-4" />;
  };

  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector<HTMLElement>("[data-radix-scroll-area-viewport]");
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [transcript.length]);

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Live Transcript
          {transcript.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {transcript.length} entries
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden px-6 pb-6 pt-0">
        <ScrollArea ref={scrollAreaRef} className="h-full pr-4" role="log" aria-live="polite" aria-relevant="additions text">
          {transcript.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No transcript yet.</p>
                <p className="text-sm">Start recording to capture the conversation.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {transcript.map((entry) => (
                <div
                  key={entry.id}
                  className={`p-3 rounded-lg border ${getSpeakerColor(entry.speaker)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getSpeakerIcon(entry.speaker)}
                      <span className="font-medium capitalize">
                        {entry.speaker}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(entry.timestamp)}
                      </span>
                      {entry.confidence && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            entry.confidence > 0.8
                              ? 'text-success border-success/50'
                              : entry.confidence > 0.6
                              ? 'text-warning border-warning/50'
                              : 'text-destructive border-destructive/50'
                          }`}
                        >
                          {Math.round(entry.confidence * 100)}%
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(entry)}
                      disabled={editingId !== null}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {editingId === entry.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="min-h-[60px]"
                        placeholder="Edit transcript..."
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit}>
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={cancelEdit}>
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{entry.text}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
