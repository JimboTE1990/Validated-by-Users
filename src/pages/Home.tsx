import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Trophy, Users, Target, MessageSquare, DollarSign, ArrowRight, Star, Gift, Zap, Shield, Mail, Clock, Bell, Rocket, Award, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-image.jpg";

const Home = () => {
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
          referralSource: 'landing_page',
          utmSource: new URLSearchParams(window.location.search).get('utm_source'),
          utmMedium: new URLSearchParams(window.location.search).get('utm_medium'),
          utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign'),
          utmContent: new URLSearchParams(window.location.search).get('utm_content'),
        }
      });

      if (error) throw error;

      toast({
        title: "You're on the list!",
        description: "Thanks for joining! We'll notify you when we launch early access.",
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="container relative z-10 py-24 text-center">
          <div className="mx-auto max-w-4xl">
            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-0">
              🚀 Coming Soon • Join the Waitlist
            </Badge>
            
            <h1 className="text-5xl font-bold tracking-tight text-foreground mb-6">
              Validate Ideas,{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Win Prizes
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join thousands of founders and users who get rewarded for building better products together.
            </p>
            
            {/* Email Capture Form */}
            <Card className="max-w-md mx-auto mb-12 border-0 bg-gradient-card shadow-lg">
              <CardContent className="p-6">
                <form onSubmit={handleWaitlistSignup} className="space-y-4">
                  <div className="text-left">
                    <label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                      Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div className="text-left">
                    <label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                      Email
                    </label>
                    <Input
                      id="email"
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
                        Join the Waitlist
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
            
            <div className="relative mx-auto max-w-3xl">
              <img 
                src={heroImage} 
                alt="Validate Ideas, Win Prizes - Product validation platform preview" 
                className="rounded-xl shadow-2xl border border-border/50"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-hero opacity-10" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Value Propositions */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Join the Waitlist?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Be among the first to experience the future of product validation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Value Prop 1 */}
            <Card className="border-0 bg-gradient-card shadow-sm text-center">
              <CardContent className="p-6">
                <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Win Real Prizes</h3>
                <p className="text-sm text-muted-foreground">
                  Get rewarded for providing valuable feedback to founders
                </p>
              </CardContent>
            </Card>
            
            {/* Value Prop 2 */}
            <Card className="border-0 bg-gradient-card shadow-sm text-center">
              <CardContent className="p-6">
                <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Validate Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Get your product ideas validated by real users quickly
                </p>
              </CardContent>
            </Card>
            
            {/* Value Prop 3 */}
            <Card className="border-0 bg-gradient-card shadow-sm text-center">
              <CardContent className="p-6">
                <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Build Together</h3>
                <p className="text-sm text-muted-foreground">
                  Join a community of founders and users helping each other succeed
                </p>
              </CardContent>
            </Card>
            
            {/* Value Prop 4 */}
            <Card className="border-0 bg-gradient-card shadow-sm text-center">
              <CardContent className="p-6">
                <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-warning/10 flex items-center justify-center">
                  <Rocket className="h-6 w-6 text-warning" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Early Access</h3>
                <p className="text-sm text-muted-foreground">
                  Be first to access new features and exclusive opportunities
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works - Pre-Launch */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to get started when we launch
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                1. Join the Waitlist
              </h3>
              <p className="text-muted-foreground">
                Sign up now to secure your spot and get notified when we launch early access.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
                <Mail className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                2. Get Updates
              </h3>
              <p className="text-muted-foreground">
                Receive exclusive updates, beta invites, and behind-the-scenes content.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                <Zap className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                3. Early Access
              </h3>
              <p className="text-muted-foreground">
                Be among the first to validate ideas, win prizes, and shape the platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Building in Public
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Follow our journey as we build the future of product validation
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Testimonial Placeholder 1 */}
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "Finally, a platform that makes product validation rewarding for everyone. Can't wait for the launch!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">SA</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Sarah A.</p>
                    <p className="text-xs text-muted-foreground">Startup Founder</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Building Update */}
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardContent className="p-6">
                <Badge variant="secondary" className="mb-3 bg-success/10 text-success border-0">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Progress Update
                </Badge>
                <h4 className="font-semibold text-foreground mb-2">Platform Development</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Core features are coming together beautifully. Prize distribution system tested and ready.
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-xs text-muted-foreground">75%</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Testimonial Placeholder 2 */}
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "Love the concept! Getting paid for feedback while helping founders succeed is genius."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-accent">MK</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Mike K.</p>
                    <p className="text-xs text-muted-foreground">Product Designer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-success" />
              <span className="text-sm text-muted-foreground">Secure & Transparent</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="text-sm text-muted-foreground">No Spam, Ever</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-success" />
              <span className="text-sm text-muted-foreground">Fair Prize Distribution</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <span className="text-sm text-muted-foreground">Growing Community</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-hero/5">
        <div className="container text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join the waitlist now and be among the first to validate ideas and win prizes.
            </p>
            
            <Button 
              variant="hero" 
              size="xl" 
              onClick={() => document.querySelector('#email')?.scrollIntoView({ behavior: 'smooth' })}
              className="min-w-[200px]"
            >
              <Rocket className="h-5 w-5" />
              Join the Waitlist Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Validate & Win</h3>
              <p className="text-sm text-muted-foreground">
                The platform where founders get validation and users get rewarded.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Coming Soon</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Product Validation</li>
                <li>Prize Pools</li>
                <li>Community Feedback</li>
                <li>Instant Rewards</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                <li><Link to="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-conditions" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Stay Updated</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Get the latest updates on our development progress.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Bell className="h-4 w-4" />
                Follow Updates
              </Button>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-12 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Validate & Win. Building the future of product validation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;