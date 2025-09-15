import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ArrowRight, Bell, Gift } from "lucide-react";
import { Link } from "react-router-dom";

const WaitlistBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-xs">
      <Card className="bg-card/95 backdrop-blur-sm border-primary/20 shadow-glow animate-in slide-in-from-bottom-5 duration-500">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <Badge variant="secondary" className="bg-accent/20 text-accent-foreground text-xs">
              🚀 Pre-Launch
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsVisible(false)}
              className="h-5 w-5 p-0 hover:bg-destructive/10 -mt-1 -mr-1"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-sm leading-tight">Early Access Available</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Join our waitlist to earn from product feedback when we launch!
            </p>
            
            <Link to="/landing" className="block">
              <Button 
                size="sm" 
                className="w-full text-xs h-8 bg-gradient-primary hover:shadow-card-hover transition-all duration-300"
              >
                <Bell className="w-3 h-3 mr-1" />
                Join Waitlist
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitlistBanner;