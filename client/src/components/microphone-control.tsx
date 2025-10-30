import { Button } from "@/components/ui/button";
import { Mic, MicOff, Square, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface MicrophoneControlProps {
  isRecording: boolean;
  isPaused: boolean;
  isActive: boolean;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  disabled?: boolean;
}

export function MicrophoneControl({
  isRecording,
  isPaused,
  isActive,
  onStart,
  onStop,
  onPause,
  onResume,
  disabled,
}: MicrophoneControlProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      {!isActive ? (
        <Button
          size="lg"
          onClick={onStart}
          disabled={disabled}
          data-testid="button-start-interview"
          className="gap-2 min-h-12 px-8 w-full sm:w-auto"
        >
          <Mic className="h-5 w-5" />
          Start Interview
        </Button>
      ) : (
        <>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={isPaused ? onResume : onPause}
              disabled={disabled}
              data-testid="button-pause-interview"
              className="h-12 w-12 flex-shrink-0"
            >
              {isPaused ? (
                <Play className="h-5 w-5" />
              ) : (
                <Pause className="h-5 w-5" />
              )}
            </Button>

            <Button
              size="lg"
              variant={isRecording ? "default" : "outline"}
              onClick={onStop}
              disabled={disabled}
              data-testid="button-stop-interview"
              className={cn(
                "gap-2 min-h-12 px-4 sm:px-8 flex-1 sm:flex-initial",
                isRecording && "bg-red-600 hover:bg-red-700 border-red-600"
              )}
            >
              <Square className="h-5 w-5" />
              <span className="hidden sm:inline">End Interview</span>
              <span className="sm:hidden">End</span>
            </Button>
          </div>

          <div
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border w-full sm:w-auto justify-center",
              isRecording && !isPaused
                ? "bg-red-500/10 border-red-500/30"
                : "bg-muted border-border"
            )}
          >
            {isRecording && !isPaused ? (
              <>
                <Mic className="h-4 w-4 text-red-500 animate-pulse" />
                <span className="text-sm font-medium text-red-500">Recording</span>
              </>
            ) : (
              <>
                <MicOff className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Paused</span>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
