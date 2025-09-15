import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mail, Clock, ArrowRight, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WaitlistSignupProps {
  title?: string;
  description?: string;
  variant?: "default" | "compact" | "hero";
  className?: string;
}

const WaitlistSignup = ({ 
  title = "Join Early Access", 
  description = "Get notified about new features and exclusive opportunities",
  variant = "default",
  className = ""
}: WaitlistSignupProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleWaitlistSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      toast({
        title: "Missing Information",
        description: "Please enter both your name and email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('waitlist-signup', {
        body: {
          email,
          name,
          referralSource: 'early_access_signup',
          utmSource: new URLSearchParams(window.location.search).get('utm_source'),
          utmMedium: new URLSearchParams(window.location.search).get('utm_medium'),
          utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign'),
          utmContent: new URLSearchParams(window.location.search).get('utm_content'),
        }
      });

      if (error) throw error;

      toast({
        title: "You're on the list!",
        description: "Thanks for joining! We'll notify you about new features and opportunities.",
      });
      
      setEmail("");
      setName("");
    } catch (error: any) {
      console.error('Waitlist signup error:', error);
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (variant === "compact") {
    return (
      <Card className={`border-0 bg-gradient-card shadow-sm ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">{title}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          
          <form onSubmit={handleWaitlistSignup} className="space-y-3">
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-9"
            />
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-9"
            />
            <Button 
              type="submit" 
              size="sm" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Clock className="h-3 w-3 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <Mail className="h-3 w-3" />
                  Join Waitlist
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (variant === "hero") {
    return (
      <Card className={`max-w-md mx-auto border-0 bg-gradient-card shadow-lg ${className}`}>
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary border-0">
              <Bell className="h-3 w-3 mr-1" />
              {title}
            </Badge>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          
          <form onSubmit={handleWaitlistSignup} className="space-y-4">
            <div className="text-left">
              <label htmlFor="waitlist-name" className="text-sm font-medium text-foreground mb-2 block">
                Name
              </label>
              <Input
                id="waitlist-name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div className="text-left">
              <label htmlFor="waitlist-email" className="text-sm font-medium text-foreground mb-2 block">
                Email
              </label>
              <Input
                id="waitlist-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <Button 
              type="submit" 
              variant="hero" 
              size="lg" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Join Waitlist
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Get early access and exclusive updates. No spam, ever.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={`border-0 bg-gradient-card shadow-sm ${className}`}>
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h3 className="font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        
        <form onSubmit={handleWaitlistSignup} className="space-y-4">
          <Input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Join Waitlist
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
        
        <p className="text-xs text-muted-foreground mt-3 text-center">
          No spam, unsubscribe anytime.
        </p>
      </CardContent>
    </Card>
  );
};

export default WaitlistSignup;