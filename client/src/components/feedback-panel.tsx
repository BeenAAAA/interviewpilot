import { FeedbackItem } from "@shared/schema";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FeedbackPanelProps {
  items: FeedbackItem[];
}

export function FeedbackPanel({ items }: FeedbackPanelProps) {
  const strengthItems = items.filter((item) => item.type === "strength");
  const mistakeItems = items.filter((item) => item.type === "mistake");
  const observationItems = items.filter((item) => item.type === "observation");

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border p-6">
        <h2 className="text-lg font-semibold text-foreground">Live Feedback</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time performance analysis
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          {/* Strengths */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <h3 className="text-sm font-semibold text-foreground">
                Strengths ({strengthItems.length})
              </h3>
            </div>
            {strengthItems.length === 0 ? (
              <p className="text-xs text-muted-foreground pl-7">
                No strengths identified yet
              </p>
            ) : (
              <div className="space-y-2">
                {strengthItems.map((item) => (
                  <div
                    key={item.id}
                    className="pl-7 p-3 rounded-lg bg-green-500/5 border border-green-500/20"
                    data-testid={`feedback-strength-${item.id}`}
                  >
                    <p className="text-sm text-foreground leading-relaxed">
                      {item.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      {format(new Date(item.timestamp), "HH:mm:ss")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mistakes */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <h3 className="text-sm font-semibold text-foreground">
                Areas for Improvement ({mistakeItems.length})
              </h3>
            </div>
            {mistakeItems.length === 0 ? (
              <p className="text-xs text-muted-foreground pl-7">
                No issues identified yet
              </p>
            ) : (
              <div className="space-y-2">
                {mistakeItems.map((item) => (
                  <div
                    key={item.id}
                    className="pl-7 p-3 rounded-lg bg-red-500/5 border border-red-500/20"
                    data-testid={`feedback-mistake-${item.id}`}
                  >
                    <p className="text-sm text-foreground leading-relaxed">
                      {item.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      {format(new Date(item.timestamp), "HH:mm:ss")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Observations */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <h3 className="text-sm font-semibold text-foreground">
                Observations ({observationItems.length})
              </h3>
            </div>
            {observationItems.length === 0 ? (
              <p className="text-xs text-muted-foreground pl-7">
                No observations yet
              </p>
            ) : (
              <div className="space-y-2">
                {observationItems.map((item) => (
                  <div
                    key={item.id}
                    className="pl-7 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20"
                    data-testid={`feedback-observation-${item.id}`}
                  >
                    <p className="text-sm text-foreground leading-relaxed">
                      {item.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      {format(new Date(item.timestamp), "HH:mm:ss")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
