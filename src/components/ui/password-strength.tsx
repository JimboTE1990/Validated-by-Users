import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PasswordStrength } from "@/hooks/usePasswordStrength";

interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
  className?: string;
}

export const PasswordStrengthIndicator = ({ 
  strength, 
  className 
}: PasswordStrengthIndicatorProps) => {
  const getStrengthColor = () => {
    switch (strength.level) {
      case 'high':
        return 'text-green-600 border-green-200 bg-green-50';
      case 'medium':
        return 'text-amber-600 border-amber-200 bg-amber-50';
      case 'low':
        return 'text-red-600 border-red-200 bg-red-50';
      default:
        return 'text-muted-foreground';
    }
  };

  const getProgressColor = () => {
    switch (strength.level) {
      case 'high':
        return 'bg-green-500';
      case 'medium':
        return 'bg-amber-500';
      case 'low':
        return 'bg-red-500';
      default:
        return 'bg-muted';
    }
  };

  const getStrengthLabel = () => {
    switch (strength.level) {
      case 'high':
        return 'Strong';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Weak';
      default:
        return 'None';
    }
  };

  if (strength.score === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Progress bar and badge */}
      <div className="flex items-center gap-2">
        <Progress 
          value={strength.score} 
          className="flex-1 h-2" 
        />
        <Badge 
          variant="outline" 
          className={cn("text-xs font-medium", getStrengthColor())}
        >
          {getStrengthLabel()}
        </Badge>
      </div>

      {/* Feedback messages */}
      {strength.feedback.length > 0 && (
        <div className="space-y-1">
          {strength.feedback.map((message, index) => (
            <p 
              key={index}
              className={cn(
                "text-xs",
                strength.level === 'high' && message.includes('Excellent') 
                  ? "text-green-600" 
                  : "text-muted-foreground"
              )}
            >
              {message}
            </p>
          ))}
        </div>
      )}

      {/* Requirements checklist */}
      <div className="grid grid-cols-2 gap-1 text-xs">
        <div className="flex items-center gap-1">
          {strength.checks.length ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <X className="h-3 w-3 text-red-500" />
          )}
          <span className={strength.checks.length ? "text-green-600" : "text-red-600"}>
            8+ characters
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {strength.checks.uppercase ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <X className="h-3 w-3 text-red-500" />
          )}
          <span className={strength.checks.uppercase ? "text-green-600" : "text-red-600"}>
            Uppercase letter
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {strength.checks.numbers ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <X className="h-3 w-3 text-red-500" />
          )}
          <span className={strength.checks.numbers ? "text-green-600" : "text-red-600"}>
            Number
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {strength.checks.special ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <X className="h-3 w-3 text-red-500" />
          )}
          <span className={strength.checks.special ? "text-green-600" : "text-red-600"}>
            Special character
          </span>
        </div>
      </div>
    </div>
  );
};