import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Flag, AlertTriangle } from "lucide-react";
import { useFeedbackReporting } from "@/hooks/useFeedbackReporting";

interface ReportFeedbackDialogProps {
  commentId: string;
  onReported?: () => void;
  trigger?: React.ReactNode;
}

export const ReportFeedbackDialog = ({ 
  commentId, 
  onReported, 
  trigger 
}: ReportFeedbackDialogProps) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const { reportFeedback, isReporting } = useFeedbackReporting();

  const reportReasons = [
    { value: "spam", label: "Spam or repetitive content" },
    { value: "inappropriate", label: "Inappropriate or offensive content" },
    { value: "irrelevant", label: "Not relevant to my product" },
    { value: "low_quality", label: "Low quality or unhelpful feedback" },
    { value: "other", label: "Other (please specify)" }
  ];

  const handleSubmit = async () => {
    if (!reason) return;

    const result = await reportFeedback(commentId, reason, details);
    
    if (result.success) {
      setOpen(false);
      setReason("");
      setDetails("");
      onReported?.();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setReason("");
    setDetails("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-destructive"
          >
            <Flag className="h-4 w-4 mr-1" />
            Report
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Report Feedback
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-sm text-muted-foreground">
            Reporting this feedback will immediately hide it from your view. 
            Our moderation team will review it, but no automatic penalties will be applied.
          </div>
          
          <div className="space-y-3">
            <Label>Why are you reporting this feedback?</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {reportReasons.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-sm font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {(reason === "other" || reason) && (
            <div className="space-y-2">
              <Label htmlFor="details">
                {reason === "other" ? "Please specify the reason" : "Additional details (optional)"}
              </Label>
              <Textarea
                id="details"
                placeholder={
                  reason === "other" 
                    ? "Please describe why you're reporting this feedback..."
                    : "Any additional context about this report..."
                }
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="min-h-[80px]"
                required={reason === "other"}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isReporting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!reason || isReporting || (reason === "other" && !details.trim())}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isReporting ? "Reporting..." : "Report & Hide"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};