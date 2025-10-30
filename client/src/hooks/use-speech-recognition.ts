import { useState, useEffect, useRef, useCallback } from "react";

interface UseSpeechRecognitionOptions {
  onTranscript?: (text: string) => void;
  onFinalTranscript?: (text: string) => void;
  onError?: (error: string) => void;
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  isSupported: boolean;
  start: () => void;
  stop: () => void;
  error: string | null;
}

// Get the browser's SpeechRecognition API
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export function useSpeechRecognition({
  onTranscript,
  onFinalTranscript,
  onError,
  continuous = true,
  interimResults = true,
  language = "en-US",
}: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const isSupported = !!SpeechRecognition;

  useEffect(() => {
    if (!isSupported) {
      setError("Speech recognition is not supported in this browser");
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("Speech recognition started");
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let interimText = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
          finalText += text + " ";
        } else {
          interimText += text;
        }
      }

      if (interimText) {
        setInterimTranscript(interimText);
        onTranscript?.(interimText);
      }

      if (finalText) {
        const trimmedText = finalText.trim();
        setTranscript((prev) => (prev ? prev + " " + trimmedText : trimmedText));
        setInterimTranscript("");
        onFinalTranscript?.(trimmedText);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      let errorMessage = "Speech recognition error";

      switch (event.error) {
        case "no-speech":
          errorMessage = "No speech detected. Please try again.";
          break;
        case "audio-capture":
          errorMessage = "No microphone found. Please check your microphone.";
          break;
        case "not-allowed":
          errorMessage = "Microphone access denied. Please allow microphone access.";
          break;
        case "network":
          errorMessage = "Network error occurred.";
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }

      setError(errorMessage);
      setIsListening(false);
      onError?.(errorMessage);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      setIsListening(false);

      // Auto-restart if continuous mode is enabled and we're supposed to be listening
      if (continuous && recognitionRef.current === recognition) {
        try {
          recognition.start();
        } catch (e) {
          console.log("Could not restart recognition:", e);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [isSupported, continuous, interimResults, language, onTranscript, onFinalTranscript, onError]);

  const start = useCallback(() => {
    if (!isSupported) {
      setError("Speech recognition is not supported in this browser");
      return;
    }

    if (isListening) {
      return;
    }

    setTranscript("");
    setInterimTranscript("");
    setError(null);

    try {
      recognitionRef.current?.start();
    } catch (e: any) {
      console.error("Error starting speech recognition:", e);
      setError("Failed to start speech recognition");
      onError?.("Failed to start speech recognition");
    }
  }, [isSupported, isListening, onError]);

  const stop = useCallback(() => {
    if (!isListening) {
      return;
    }

    try {
      recognitionRef.current?.stop();
      setIsListening(false);
    } catch (e: any) {
      console.error("Error stopping speech recognition:", e);
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    start,
    stop,
    error,
  };
}
