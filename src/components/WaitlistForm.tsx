import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  name: string;
  email: string;
}

const WaitlistForm = () => {
  const [formData, setFormData] = useState<FormData>({ name: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both name and email fields.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.functions.invoke('waitlist-signup', {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          referral_source: 'landing_page',
          utm_source: new URLSearchParams(window.location.search).get('utm_source'),
          utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
          utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
          utm_content: new URLSearchParams(window.location.search).get('utm_content'),
        }
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Welcome to the Waitlist! 🎉",
        description: "You'll be notified as soon as we launch.",
      });
      
      // Reset form after success
      setFormData({ name: "", email: "" });
      
    } catch (error: any) {
      console.error('Waitlist signup error:', error);
      
      if (error.message?.includes('duplicate key') || error.message?.includes('already exists')) {
        toast({
          title: "Already Signed Up",
          description: "This email is already on our waitlist. Thanks for your interest!",
        });
      } else {
        toast({
          title: "Something Went Wrong",
          description: "Please try again or contact support if the issue persists.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="max-w-md mx-auto bg-gradient-success/10 border-success/20">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4 shadow-prize">
            <CheckCircle className="w-8 h-8 text-success-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">You're On the List!</h3>
          <p className="text-muted-foreground mb-4">
            We'll notify you as soon as we launch. Get ready to start earning from your feedback!
          </p>
          <Button 
            variant="outline" 
            onClick={() => setIsSuccess(false)}
            className="border-success/20 hover:bg-success/10"
          >
            Sign Up Another Email
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto shadow-card-hover hover:shadow-glow transition-all duration-500">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-lg">Join the Waitlist</h3>
            <p className="text-sm text-muted-foreground">Be first to earn from product feedback</p>
          </div>

          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="transition-smooth focus:ring-2 focus:ring-primary/20"
              disabled={isLoading}
            />
            
            <Input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="transition-smooth focus:ring-2 focus:ring-primary/20"
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              "Get Early Access"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WaitlistForm;