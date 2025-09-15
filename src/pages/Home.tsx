import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Trophy, Users, Target, MessageSquare, DollarSign, ArrowRight, Star, Gift, Zap, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import WaitlistSignup from "@/components/WaitlistSignup";
import heroImage from "@/assets/hero-image.jpg";
import mockupStep1 from "@/assets/mockup-step1-form.jpg";
import mockupStep2 from "@/assets/mockup-step2-discover.jpg";
import mockupStep3 from "@/assets/mockup-step3-payouts.jpg";
import mockupFounderPost from "@/assets/mockup-founder-post.jpg";
import mockupUserFeedback from "@/assets/mockup-user-feedback.jpg";
import mockupWinnerScreen from "@/assets/mockup-winner-screen.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="container relative z-10 py-24 text-center">
          <div className="mx-auto max-w-4xl">
            <Badge variant="secondary" className="mb-6 bg-success/10 text-success border-0">
              <CheckCircle className="h-3 w-3 mr-1" />
              Live Platform • Join Today
            </Badge>
            
            <h1 className="text-5xl font-bold tracking-tight text-foreground mb-6">
              Validate Ideas,{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Win Prizes
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              The first platform where founders and users both win. Validate products through prize-backed feedback competitions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild variant="hero" size="xl">
                <Link to="/auth">
                  <Trophy className="h-5 w-5" />
                  Start Validating
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/feed">
                  <MessageSquare className="h-5 w-5" />
                  Browse Contests
                </Link>
              </Button>
            </div>
            
            <div className="relative mx-auto max-w-4xl">
              <img 
                src={heroImage} 
                alt="Validated by Users platform - where founders and users win together" 
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
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The only validation platform that rewards both founders and users
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Value Prop 1 */}
            <Card className="border-0 bg-gradient-card shadow-sm text-center hover:shadow-card-hover transition-all">
              <CardContent className="p-6">
                <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Win Real Money</h3>
                <p className="text-sm text-muted-foreground">
                  Earn cash prizes for providing valuable feedback to founders
                </p>
              </CardContent>
            </Card>
            
            {/* Value Prop 2 */}
            <Card className="border-0 bg-gradient-card shadow-sm text-center hover:shadow-card-hover transition-all">
              <CardContent className="p-6">
                <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Fast Validation</h3>
                <p className="text-sm text-muted-foreground">
                  Get your product validated by real users in days, not months
                </p>
              </CardContent>
            </Card>
            
            {/* Value Prop 3 */}
            <Card className="border-0 bg-gradient-card shadow-sm text-center hover:shadow-card-hover transition-all">
              <CardContent className="p-6">
                <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Quality Feedback</h3>
                <p className="text-sm text-muted-foreground">
                  Prize incentives ensure thoughtful, actionable user feedback
                </p>
              </CardContent>
            </Card>
            
            {/* Value Prop 4 */}
            <Card className="border-0 bg-gradient-card shadow-sm text-center hover:shadow-card-hover transition-all">
              <CardContent className="p-6">
                <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-warning/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-warning" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Fair & Transparent</h3>
                <p className="text-sm text-muted-foreground">
                  Automated winner selection and secure prize distribution
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to validate your product and win prizes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Step 1 - For Founders */}
            <div className="text-center">
              <div className="relative mb-8">
                <img 
                  src={mockupStep1} 
                  alt="Step 1: Founders create validation contests with prize pools"
                  className="rounded-xl shadow-lg border border-border/50 mx-auto max-w-full h-auto"
                />
                <Badge className="absolute -top-3 -left-3 bg-primary text-primary-foreground">
                  1. Founders
                </Badge>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Create Contest
              </h3>
              <p className="text-muted-foreground">
                Post your product, set a prize pool, and define what feedback you need.
              </p>
            </div>
            
            {/* Step 2 - For Users */}
            <div className="text-center">
              <div className="relative mb-8">
                <img 
                  src={mockupStep2} 
                  alt="Step 2: Users discover and provide feedback on products"
                  className="rounded-xl shadow-lg border border-border/50 mx-auto max-w-full h-auto"
                />
                <Badge className="absolute -top-3 -left-3 bg-success text-success-foreground">
                  2. Users
                </Badge>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Provide Feedback
              </h3>
              <p className="text-muted-foreground">
                Browse products, give valuable feedback, and compete for prizes.
              </p>
            </div>
            
            {/* Step 3 - Payouts */}
            <div className="text-center">
              <div className="relative mb-8">
                <img 
                  src={mockupStep3} 
                  alt="Step 3: Winners receive prize money automatically"
                  className="rounded-xl shadow-lg border border-border/50 mx-auto max-w-full h-auto"
                />
                <Badge className="absolute -top-3 -left-3 bg-warning text-warning-foreground">
                  3. Win Prizes
                </Badge>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Get Paid
              </h3>
              <p className="text-muted-foreground">
                Winners are selected automatically and prizes are distributed securely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Screenshots */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              See It In Action
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real screenshots from our live platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <img 
                src={mockupFounderPost} 
                alt="Founder posting a product for validation"
                className="rounded-xl shadow-lg border border-border/50 mx-auto mb-4"
              />
              <h4 className="font-semibold text-foreground mb-2">Founder Dashboard</h4>
              <p className="text-sm text-muted-foreground">Easy product posting and contest management</p>
            </div>
            
            <div className="text-center">
              <img 
                src={mockupUserFeedback} 
                alt="User providing detailed feedback"
                className="rounded-xl shadow-lg border border-border/50 mx-auto mb-4"
              />
              <h4 className="font-semibold text-foreground mb-2">Feedback Interface</h4>
              <p className="text-sm text-muted-foreground">Structured feedback forms for quality insights</p>
            </div>
            
            <div className="text-center">
              <img 
                src={mockupWinnerScreen} 
                alt="Winner announcement and prize distribution"
                className="rounded-xl shadow-lg border border-border/50 mx-auto mb-4"
              />
              <h4 className="font-semibold text-foreground mb-2">Winner Selection</h4>
              <p className="text-sm text-muted-foreground">Transparent winner announcement and payouts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Trusted by Founders & Users
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join a growing community of successful product validation
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            {/* Stats */}
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">£12,500+</div>
              <p className="text-sm text-muted-foreground">Prize Money Distributed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">150+</div>
              <p className="text-sm text-muted-foreground">Products Validated</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">500+</div>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Testimonial 1 */}
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "Got invaluable feedback on my SaaS idea and improved my conversion rate by 40%. Worth every penny!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">SA</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Sarah A.</p>
                    <p className="text-xs text-muted-foreground">SaaS Founder</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Testimonial 2 */}
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "Won £200 last month just by giving feedback on cool products. Easy side income!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-success">MK</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Mike K.</p>
                    <p className="text-xs text-muted-foreground">UX Designer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Testimonial 3 */}
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "The quality of feedback here is incredible. Users are motivated to give real, thoughtful insights."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-accent">JL</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">James L.</p>
                    <p className="text-xs text-muted-foreground">E-commerce Founder</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Early Access Waitlist */}
      <section className="py-24 bg-gradient-hero/5">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-6 bg-accent/10 text-accent border-0">
              <Gift className="h-3 w-3 mr-1" />
              New Features Coming Soon
            </Badge>
            
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Get Early Access to New Features
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Be the first to try advanced analytics, automated insights, and enhanced prize distribution features.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
            <WaitlistSignup 
              variant="compact"
              title="Beta Features Access"
              description="Get notified when new features are ready for testing"
            />
            
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Coming Soon:</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Advanced Analytics Dashboard
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  AI-Powered Feedback Insights
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Enhanced Prize Distribution
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Mobile App Beta
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-success" />
              <span className="text-sm text-muted-foreground">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="text-sm text-muted-foreground">Verified Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-success" />
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
      <section className="py-24 bg-muted/30">
        <div className="container text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Validate Your Idea?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join hundreds of founders who have successfully validated their products and thousands of users earning prizes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="hero" size="xl">
                <Link to="/auth">
                  <Trophy className="h-5 w-5" />
                  Start Your Contest
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/feed">
                  <MessageSquare className="h-5 w-5" />
                  Browse & Win Prizes
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Validated by Users</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The first platform where founders and users both win through prize-backed product validation.
              </p>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-success" />
                <span className="text-xs text-muted-foreground">Secure & Trusted</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">For Founders</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/auth" className="hover:text-foreground transition-colors">Create Contest</Link></li>
                <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                <li><Link to="/help" className="hover:text-foreground transition-colors">How to Validate</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">For Users</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/feed" className="hover:text-foreground transition-colors">Browse Contests</Link></li>
                <li><Link to="/profile" className="hover:text-foreground transition-colors">My Winnings</Link></li>
                <li><Link to="/help" className="hover:text-foreground transition-colors">How to Win</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Validated by Users. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;