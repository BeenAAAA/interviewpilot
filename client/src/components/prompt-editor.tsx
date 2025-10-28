import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { PRESET_PROMPTS, DEFAULT_SYSTEM_PROMPT } from "@shared/schema";
import { cn } from "@/lib/utils";

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PromptEditor({ value, onChange, disabled }: PromptEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePresetChange = (presetId: string) => {
    if (presetId === "default") {
      onChange(DEFAULT_SYSTEM_PROMPT);
    } else {
      const preset = PRESET_PROMPTS.find((p) => p.id === presetId);
      if (preset) onChange(preset.template);
    }
  };

  const handleReset = () => {
    onChange(DEFAULT_SYSTEM_PROMPT);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">AI Interviewer Prompt</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          data-testid="button-toggle-prompt"
          className="h-8"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className={cn("space-y-4", !isExpanded && "hidden")}>
        <div className="flex gap-2">
          <Select onValueChange={handlePresetChange} disabled={disabled}>
            <SelectTrigger className="flex-1 bg-background" data-testid="select-prompt-preset">
              <SelectValue placeholder="Choose a preset..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default Interview</SelectItem>
              {PRESET_PROMPTS.map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            disabled={disabled}
            data-testid="button-reset-prompt"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Customize the AI interviewer's behavior and focus areas..."
          disabled={disabled}
          rows={8}
          data-testid="textarea-custom-prompt"
          className="resize-none bg-background font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          {value.length} characters
        </p>
      </div>
    </div>
  );
}
