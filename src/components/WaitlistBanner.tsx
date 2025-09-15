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
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-md mx-auto px-4">
      <Card className="bg-gradient-primary/10 border-primary/20 shadow-glow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <Bell className="w-4 h-4 text-primary-foreground" />
              </div>
              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground text-xs">
                Pre-Launch
              </Badge>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0 hover:bg-destructive/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-sm mb-1">🎉 Early Access Available</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Join our waitlist to be first to earn from product feedback when we launch!
              </p>
            </div>
            
            <Link to="/landing" className="block">
              <Button 
                size="sm" 
                className="w-full bg-gradient-primary hover:shadow-card-hover transition-all duration-300"
              >
                <Gift className="w-3 h-3 mr-2" />
                Get Early Access
                <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitlistBanner;