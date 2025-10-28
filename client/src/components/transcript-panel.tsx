import { useEffect, useRef } from "react";
import { TranscriptMessage } from "@shared/schema";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TranscriptPanelProps {
  messages: TranscriptMessage[];
  isLoading?: boolean;
}

export function TranscriptPanel({ messages, isLoading }: TranscriptPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border p-6">
        <h2 className="text-lg font-semibold text-foreground">Interview Transcript</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Live conversation with AI interviewer
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6" data-testid="transcript-container">
        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                No messages yet. Start the interview to begin the conversation.
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.speaker === "candidate" ? "justify-end" : "justify-start"
            )}
            data-testid={`message-${message.speaker}-${message.id}`}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-4 space-y-2",
                message.speaker === "candidate"
                  ? "bg-primary/10 border border-primary/20"
                  : "bg-muted border border-border"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">
                  {message.speaker === "candidate" ? "You" : "Interviewer"}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {format(new Date(message.timestamp), "HH:mm:ss")}
                </span>
              </div>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {message.text}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-4 bg-muted border border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">Interviewer</span>
                <span className="text-xs text-muted-foreground">typing...</span>
              </div>
              <div className="flex gap-1 mt-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
