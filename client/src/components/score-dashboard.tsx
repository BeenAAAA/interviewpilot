import { CircularProgress } from "@/components/ui/circular-progress";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ScoreDashboardProps {
  score: number;
  previousScore?: number;
}

export function ScoreDashboard({ score, previousScore = 0 }: ScoreDashboardProps) {
  const scoreDiff = score - previousScore;
  const trend = scoreDiff > 2 ? "up" : scoreDiff < -2 ? "down" : "neutral";

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Very Good";
    if (score >= 60) return "Good";
    if (score >= 45) return "Fair";
    return "Needs Work";
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 45) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col items-center space-y-4 sm:space-y-6">
        <div className="text-center">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Interview Score
          </h3>
          <p className="text-xs text-muted-foreground">
            Real-time performance rating
          </p>
        </div>

        <CircularProgress value={score} size={160} strokeWidth={10} className="sm:w-[180px] sm:h-[180px]" />

        <div className="text-center space-y-2">
          <p className={`text-lg font-bold ${getScoreColor(score)}`}>
            {getScoreLabel(score)}
          </p>

          {previousScore > 0 && (
            <div className="flex items-center justify-center gap-1 text-sm">
              {trend === "up" && (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-500 font-medium">
                    +{Math.abs(scoreDiff).toFixed(1)}
                  </span>
                </>
              )}
              {trend === "down" && (
                <>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-red-500 font-medium">
                    {scoreDiff.toFixed(1)}
                  </span>
                </>
              )}
              {trend === "neutral" && (
                <>
                  <Minus className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground font-medium">
                    No change
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
