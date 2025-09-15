import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import WaitlistForm from "@/components/WaitlistForm";
import { CheckCircle, DollarSign, Rocket, Target, Users, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-bold text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Validated by Users
          </div>
          <Link to="/">
            <Button variant="ghost">View App</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-accent/10 text-accent-foreground border-accent/20">
              🚀 Launching Soon
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Get Paid to Test
              <span className="bg-gradient-primary bg-clip-text text-transparent block">
                Ideas First
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
              Join the community where founders pay real money for your honest product feedback - launching soon.
            </p>

            <div className="max-w-md mx-auto">
              <WaitlistForm />
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              No spam, ever. Get notified when we launch.
            </p>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Join Early?</h2>
            <p className="text-xl text-muted-foreground">Be among the first to shape the future of product validation</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-8 bg-gradient-card shadow-card-hover hover:shadow-glow transition-all duration-500">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-prize">
                  <DollarSign className="w-8 h-8 text-success-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Earn Real Money</h3>
                <p className="text-muted-foreground">Get paid for thoughtful product feedback with transparent prize pools</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-gradient-card shadow-card-hover hover:shadow-glow transition-all duration-500">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Rocket className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Early Access</h3>
                <p className="text-muted-foreground">Be first to try revolutionary products before they launch publicly</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-gradient-card shadow-card-hover hover:shadow-glow transition-all duration-500">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Quality Matters</h3>
                <p className="text-muted-foreground">Your detailed insights help shape tomorrow's innovations</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-gradient-card shadow-card-hover hover:shadow-glow transition-all duration-500">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-warning" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Fair Rewards</h3>
                <p className="text-muted-foreground">Transparent prize pools and automated winner selection</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple steps to start earning from your feedback</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-card-hover">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="font-semibold text-xl mb-3">Join Waitlist</h3>
              <p className="text-muted-foreground">Sign up to secure your early access spot and get launch updates</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-prize">
                <span className="text-2xl font-bold text-success-foreground">2</span>
              </div>
              <h3 className="font-semibold text-xl mb-3">Get Notified</h3>
              <p className="text-muted-foreground">Receive exclusive updates on our progress and launch timeline</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-accent">3</span>
              </div>
              <h3 className="font-semibold text-xl mb-3">Early Access</h3>
              <p className="text-muted-foreground">Be among the first to start earning from product feedback</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Placeholder */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-12">Building in Public</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">Early Interest</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-success mb-2">£10k+</div>
              <p className="text-muted-foreground">Prize Pool Ready</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-accent mb-2">100%</div>
              <p className="text-muted-foreground">Fair & Transparent</p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-8">
            <p className="text-lg italic text-muted-foreground mb-4">
              "Finally, a platform where my product feedback actually has value. Can't wait to see this launch!"
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold">Early Beta Tester</div>
                <div className="text-sm text-muted-foreground">Product Enthusiast</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Second CTA */}
      <section className="py-20 px-6 bg-gradient-hero/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Don't Miss Out</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join hundreds of others waiting for early access to earn from product feedback
          </p>
          
          <div className="max-w-md mx-auto mb-8">
            <WaitlistForm />
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>No spam ever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Early access guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Free to join</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent mb-4 md:mb-0">
              Validated by Users
            </div>
            <div className="flex items-center gap-6">
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link to="/">
                <Button variant="outline" size="sm">
                  View App <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;