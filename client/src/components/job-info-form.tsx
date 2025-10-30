import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface JobInfoFormProps {
  jobTitle: string;
  companyName: string;
  jobRequirements: string;
  onJobTitleChange: (value: string) => void;
  onCompanyNameChange: (value: string) => void;
  onJobRequirementsChange: (value: string) => void;
  disabled?: boolean;
}

export function JobInfoForm({
  jobTitle,
  companyName,
  jobRequirements,
  onJobTitleChange,
  onCompanyNameChange,
  onJobRequirementsChange,
  disabled,
}: JobInfoFormProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <Label htmlFor="job-title" className="text-sm font-semibold">
          Job Title
        </Label>
        <Input
          id="job-title"
          value={jobTitle}
          onChange={(e) => onJobTitleChange(e.target.value)}
          placeholder="e.g., Senior Frontend Developer"
          disabled={disabled}
          data-testid="input-job-title"
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company-name" className="text-sm font-semibold">
          Company Name
        </Label>
        <Input
          id="company-name"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          placeholder="e.g., TechCorp Inc."
          disabled={disabled}
          data-testid="input-company-name"
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="job-requirements" className="text-sm font-semibold">
          Key Requirements
        </Label>
        <Textarea
          id="job-requirements"
          value={jobRequirements}
          onChange={(e) => onJobRequirementsChange(e.target.value)}
          placeholder="List the key skills and requirements for this position..."
          disabled={disabled}
          rows={6}
          data-testid="input-job-requirements"
          className="resize-none bg-background"
        />
        <p className="text-xs text-muted-foreground">
          {jobRequirements.length} characters
        </p>
      </div>
    </div>
  );
}
