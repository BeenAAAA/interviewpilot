import { Upload, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";

interface ResumeUploadProps {
  onResumeText: (text: string) => void;
  value?: string;
  disabled?: boolean;
}

export function ResumeUpload({ onResumeText, value, disabled }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;
    
    setFileName(file.name);
    
    if (file.type === "application/pdf") {
      const formData = new FormData();
      formData.append("file", file);
      
      try {
        const response = await fetch("/api/parse-resume", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        onResumeText(data.text || "");
      } catch (error) {
        console.error("Failed to parse PDF:", error);
      }
    } else if (file.type === "text/plain") {
      const text = await file.text();
      onResumeText(text);
    }
  }, [onResumeText]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const clearResume = useCallback(() => {
    setFileName("");
    onResumeText("");
  }, [onResumeText]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground">Resume</label>
        {fileName && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearResume}
            disabled={disabled}
            data-testid="button-clear-resume"
            className="h-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {!value ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-border hover-elevate",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={handleChange}
            disabled={disabled}
            className="absolute inset-0 opacity-0 cursor-pointer"
            data-testid="input-resume-file"
          />
          <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground mb-1">
            Drop your resume here or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supports PDF and TXT files
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground mb-1 truncate">
                {fileName || "Resume loaded"}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-3">
                {value.substring(0, 150)}...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
