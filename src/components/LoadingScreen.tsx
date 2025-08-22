import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  title: string;
  description: string;
  onComplete?: () => void;
  autoComplete?: boolean;
  completionDelay?: number;
}

const LoadingScreen = ({ 
  title, 
  description, 
  onComplete, 
  autoComplete = false,
  completionDelay = 2000 
}: LoadingScreenProps) => {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (autoComplete) {
      const timer = setTimeout(() => {
        setIsComplete(true);
        setTimeout(() => {
          onComplete?.();
        }, 1000);
      }, completionDelay);

      return () => clearTimeout(timer);
    }
  }, [autoComplete, completionDelay, onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            {isComplete ? (
              <div className="h-16 w-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            ) : (
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {isComplete ? "Complete!" : title}
          </h2>
          <p className="text-muted-foreground">
            {isComplete ? "Redirecting you now..." : description}
          </p>

          {!autoComplete && !isComplete && (
            <div className="mt-6">
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingScreen;