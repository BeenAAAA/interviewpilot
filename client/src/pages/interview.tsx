import { useState, useCallback, useEffect, useRef } from "react";
import { ResumeUpload } from "@/components/resume-upload";
import { JobInfoForm } from "@/components/job-info-form";
import { PromptEditor } from "@/components/prompt-editor";
import { TranscriptPanel } from "@/components/transcript-panel";
import { FeedbackPanel } from "@/components/feedback-panel";
import { ScoreDashboard } from "@/components/score-dashboard";
import { MicrophoneControl } from "@/components/microphone-control";
import { ChatInput } from "@/components/chat-input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw } from "lucide-react";
import { DEFAULT_SYSTEM_PROMPT, TranscriptMessage, FeedbackItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

export default function Interview() {
  const { toast } = useToast();
  const wsRef = useRef<WebSocket | null>(null);

  // Session state
  const [sessionId, setSessionId] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "active" | "paused" | "completed">("idle");
  const [isRecording, setIsRecording] = useState(false);

  // Form state
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);

  // Interview data
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [score, setScore] = useState(50);
  const [previousScore, setPreviousScore] = useState(50);
  const [interimTranscript, setInterimTranscript] = useState("");

  // Speech recognition for microphone input
  const speechRecognition = useSpeechRecognition({
    onTranscript: (text) => {
      setInterimTranscript(text);
    },
    onFinalTranscript: (text) => {
      // Send the transcribed text as a candidate response
      if (text.trim() && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "candidate_response",
            sessionId: sessionId,
            text: text,
          })
        );
      }
      setInterimTranscript("");
    },
    onError: (error) => {
      toast({
        title: "Microphone Error",
        description: error,
        variant: "destructive",
      });
      setIsRecording(false);
    },
    continuous: true,
    interimResults: true,
  });

  // WebSocket connection
  const connectWebSocket = useCallback((newSessionId: string) => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

    ws.onopen = () => {
      console.log("WebSocket connected");
      // Start the interview
      ws.send(JSON.stringify({ type: "start", sessionId: newSessionId }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "transcript":
          setMessages((prev) => [
            ...prev,
            {
              id: data.id,
              sessionId: sessionId,
              speaker: data.speaker,
              text: data.text,
              timestamp: data.timestamp,
            },
          ]);
          break;

        case "feedback":
          setFeedbackItems((prev) => [
            ...prev,
            {
              id: data.id,
              sessionId: sessionId,
              type: data.feedbackType,
              text: data.text,
              timestamp: data.timestamp,
            },
          ]);
          break;

        case "score":
          setPreviousScore(score);
          setScore(data.score);
          break;

        case "status":
          setStatus(data.status);
          break;

        case "error":
          toast({
            title: "Error",
            description: data.message,
            variant: "destructive",
          });
          break;
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the interview server.",
        variant: "destructive",
      });
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    wsRef.current = ws;
    return ws;
  }, [score, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleStartInterview = useCallback(async () => {
    if (!resumeText.trim()) {
      toast({
        title: "Resume Required",
        description: "Please upload your resume before starting the interview.",
        variant: "destructive",
      });
      return;
    }

    if (!jobTitle.trim() || !companyName.trim()) {
      toast({
        title: "Job Info Required",
        description: "Please provide job title and company name.",
        variant: "destructive",
      });
      return;
    }

    if (!speechRecognition.isSupported) {
      toast({
        title: "Microphone Not Supported",
        description: "Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobTitle,
          companyName,
          jobRequirements,
          systemPrompt,
        }),
      });

      const data = await response.json();
      const newSessionId = data.sessionId;
      setSessionId(newSessionId);
      setStatus("active");
      setIsRecording(true);

      // Connect WebSocket
      connectWebSocket(newSessionId);

      // Start speech recognition
      speechRecognition.start();

      toast({
        title: "Interview Started",
        description: "Good luck! The interviewer will begin shortly. You can speak your answers.",
      });
    } catch (error) {
      console.error("Failed to start interview:", error);
      toast({
        title: "Error",
        description: "Failed to start the interview. Please try again.",
        variant: "destructive",
      });
    }
  }, [resumeText, jobTitle, companyName, jobRequirements, systemPrompt, connectWebSocket, toast, speechRecognition]);

  const handleSendMessage = useCallback(
    (text: string) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "candidate_response",
            sessionId: sessionId,
            text: text,
          })
        );
      }
    },
    [sessionId]
  );

  const handleStopInterview = useCallback(async () => {
    if (!sessionId) return;

    try {
      await fetch(`/api/interview/${sessionId}/stop`, {
        method: "POST",
      });

      setStatus("completed");
      setIsRecording(false);

      // Stop speech recognition
      speechRecognition.stop();
      setInterimTranscript("");

      if (wsRef.current) {
        wsRef.current.close();
      }

      toast({
        title: "Interview Completed",
        description: `Final score: ${score}/100`,
      });
    } catch (error) {
      console.error("Failed to stop interview:", error);
    }
  }, [sessionId, score, toast, speechRecognition]);

  const handlePauseInterview = useCallback(async () => {
    if (!sessionId) return;

    try {
      await fetch(`/api/interview/${sessionId}/pause`, {
        method: "POST",
      });

      setStatus("paused");
      setIsRecording(false);

      // Stop speech recognition when paused
      speechRecognition.stop();
      setInterimTranscript("");
    } catch (error) {
      console.error("Failed to pause interview:", error);
    }
  }, [sessionId, speechRecognition]);

  const handleResumeInterview = useCallback(async () => {
    if (!sessionId) return;

    try {
      await fetch(`/api/interview/${sessionId}/resume`, {
        method: "POST",
      });

      setStatus("active");
      setIsRecording(true);

      // Restart speech recognition when resumed
      speechRecognition.start();
    } catch (error) {
      console.error("Failed to resume interview:", error);
    }
  }, [sessionId, speechRecognition]);

  const handleReset = useCallback(() => {
    setSessionId("");
    setStatus("idle");
    setIsRecording(false);
    setMessages([]);
    setFeedbackItems([]);
    setScore(50);
    setPreviousScore(50);
    setResumeText("");
    setJobTitle("");
    setCompanyName("");
    setJobRequirements("");
    setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
    setInterimTranscript("");

    // Stop speech recognition
    speechRecognition.stop();

    if (wsRef.current) {
      wsRef.current.close();
    }

    toast({
      title: "Session Reset",
      description: "You can start a new interview.",
    });
  }, [toast, speechRecognition]);

  const handleDownloadTranscript = useCallback(() => {
    const transcript = messages
      .map((msg) => `[${msg.timestamp}] ${msg.speaker === "candidate" ? "You" : "Interviewer"}: ${msg.text}`)
      .join("\n\n");

    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview-transcript-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Transcript Downloaded",
      description: "Your interview transcript has been saved.",
    });
  }, [messages, toast]);

  const isFormDisabled = status === "active" || status === "paused";

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Interview Coach</h1>
              <p className="text-sm text-muted-foreground mt-1">
                AI-powered mock interview practice with real-time feedback
              </p>
            </div>
            <div className="flex items-center gap-3">
              {status === "completed" && messages.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadTranscript}
                  data-testid="button-download-transcript"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              )}
              {status === "completed" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  data-testid="button-reset"
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  New Interview
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Three-column layout */}
      <div className="flex-1 flex overflow-hidden max-w-[1800px] mx-auto w-full">
        {/* Left Panel - Input Forms */}
        <div className="w-[400px] border-r border-border bg-card flex-shrink-0">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              <ResumeUpload
                onResumeText={setResumeText}
                value={resumeText}
                disabled={isFormDisabled}
              />

              <Separator />

              <JobInfoForm
                jobTitle={jobTitle}
                companyName={companyName}
                jobRequirements={jobRequirements}
                onJobTitleChange={setJobTitle}
                onCompanyNameChange={setCompanyName}
                onJobRequirementsChange={setJobRequirements}
                disabled={isFormDisabled}
              />

              <Separator />

              <PromptEditor
                value={systemPrompt}
                onChange={setSystemPrompt}
                disabled={isFormDisabled}
              />
            </div>
          </ScrollArea>
        </div>

        {/* Center Panel - Transcript */}
        <div className="flex-1 flex flex-col min-w-0">
          <TranscriptPanel messages={messages} isLoading={status === "active" && isRecording} />

          {/* Controls */}
          <div className="border-t border-border bg-card p-6 space-y-4">
            {status === "active" && (
              <>
                {/* Show interim transcript when speaking */}
                {interimTranscript && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Listening...</p>
                    <p className="text-base text-foreground italic">{interimTranscript}</p>
                  </div>
                )}
                <ChatInput
                  onSend={handleSendMessage}
                  disabled={status !== "active"}
                  placeholder="Type your response or speak your answer..."
                />
              </>
            )}
            <MicrophoneControl
              isRecording={isRecording}
              isPaused={status === "paused"}
              isActive={status === "active" || status === "paused"}
              onStart={handleStartInterview}
              onStop={handleStopInterview}
              onPause={handlePauseInterview}
              onResume={handleResumeInterview}
              disabled={status === "completed"}
            />
          </div>
        </div>

        {/* Right Panel - Score & Feedback */}
        <div className="w-[480px] border-l border-border bg-card flex-shrink-0 flex flex-col">
          <div className="p-6 border-b border-border">
            <ScoreDashboard score={score} previousScore={previousScore} />
          </div>
          <div className="flex-1 overflow-hidden">
            <FeedbackPanel items={feedbackItems} />
          </div>
        </div>
      </div>
    </div>
  );
}
