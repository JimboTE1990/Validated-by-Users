import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { ArrowRight, Trophy, Users, Zap, Star, MessageCircle, Target, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useStatistics } from "@/hooks/useStatistics";
import heroImage from "@/assets/hero-image.jpg";
import mockupStep1Form from "@/assets/mockup-step1-form.jpg";
import mockupStep2Discover from "@/assets/mockup-step2-discover.jpg";
import mockupStep3Payouts from "@/assets/mockup-step3-payouts.jpg";

const Home = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const { stats, loading } = useStatistics();

  const scrollToStep = (stepNumber: number) => {
    setActiveStep(activeStep === stepNumber ? null : stepNumber);
    const element = document.getElementById(`step-${stepNumber}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="container relative z-10 py-24 text-center">
          <div className="mx-auto max-w-4xl">
            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-0">
              🎯 Validate • Get Rewarded • Grow Together
            </Badge>
            
            <h1 className="text-5xl font-bold tracking-tight text-foreground mb-6">
              Get Your Product{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Validated by Users
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Founders create prize pools for feedback. Users get rewarded for validation. 
              Everyone wins in this rewarding ecosystem of growth and discovery.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/feed">
                <Button variant="hero" size="xl" className="min-w-[200px]">
                  <Trophy className="h-5 w-5" />
                  Explore Prize Pools
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/create-post">
                <Button variant="outline" size="xl" className="min-w-[200px]">
                  <Users className="h-5 w-5" />
                  Request User Feedback
                </Button>
              </Link>
            </div>
            
            <div className="relative mx-auto max-w-4xl">
              <img 
                src={heroImage} 
                alt="Founders collaborating and getting validated" 
                className="rounded-xl shadow-2xl border border-border/50"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-hero opacity-10" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple, rewarding process that benefits everyone in the ecosystem
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card 
              className="border-0 bg-gradient-card shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg hover:bg-gradient-card/80"
              onClick={() => scrollToStep(1)}
            >
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center justify-center gap-2">
                  1. Founders Post
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </h3>
                <p className="text-muted-foreground">
                  Share your product, set a prize pool, and get ready for valuable feedback from real users.
                </p>
              </CardContent>
            </Card>
            
            <Card 
              className="border-0 bg-gradient-card shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg hover:bg-gradient-card/80"
              onClick={() => scrollToStep(2)}
            >
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center justify-center gap-2">
                  2. Users Validate
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </h3>
                <p className="text-muted-foreground">
                  Leave thoughtful feedback and automatically enter the prize draw. Better feedback = more entries.
                </p>
              </CardContent>
            </Card>
            
            <Card 
              className="border-0 bg-gradient-card shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg hover:bg-gradient-card/80"
              onClick={() => scrollToStep(3)}
            >
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center justify-center gap-2">
                  3. Everyone Wins
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </h3>
                <p className="text-muted-foreground">
                  Winners get rewarded, founders get validation, and great products get built.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Step Sections */}
      <section className="py-16 bg-background">
        <div className="container">
          {/* Step 1 Details */}
          <div id="step-1" className={`mb-16 transition-all duration-500 ${activeStep === 1 ? 'opacity-100' : 'opacity-60'}`}>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Step 1: Founders Post</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  Create your validation post in minutes. Share your product details, set your prize pool budget, 
                  and let our community help you improve.
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    Describe your product or startup concept
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    Set your prize pool (£10 - £500)
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    Choose your validation timeline
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    Go live and start receiving feedback
                  </li>
                </ul>
              </div>
              <div className="relative">
                <img 
                  src={mockupStep1Form} 
                  alt="Step 1: Data entry form for founders to create validation posts"
                  className="w-full h-auto rounded-lg shadow-2xl border border-border/50"
                />
              </div>
            </div>
          </div>

          {/* Step 2 Details */}
          <div id="step-2" className={`mb-16 transition-all duration-500 ${activeStep === 2 ? 'opacity-100' : 'opacity-60'}`}>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <img 
                  src={mockupStep2Discover} 
                  alt="Step 2: Discover section showing validation posts and prize pools"
                  className="w-full h-auto rounded-lg shadow-2xl border border-border/50"
                />
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-success" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Step 2: Users Validate</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  Users browse active prize pools, provide thoughtful feedback, and automatically 
                  enter the draw. Quality feedback gets boosted by founders for extra entries.
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-success" />
                    Browse products seeking validation
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-success" />
                    Leave detailed, constructive feedback
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-success" />
                    Get automatic entry into prize draw
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-success" />
                    Earn bonus entries for boosted comments
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3 Details */}
          <div id="step-3" className={`mb-16 transition-all duration-500 ${activeStep === 3 ? 'opacity-100' : 'opacity-60'}`}>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Step 3: Everyone Wins</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  When the validation period ends, winners are drawn fairly and transparently. 
                  Founders get valuable insights, users get rewarded, and great products get built.
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    Transparent, automated prize draws
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    Winners receive instant notifications
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    Founders get comprehensive feedback reports
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    Community builds better products together
                  </li>
                </ul>
              </div>
              <div className="relative">
                <img 
                  src={mockupStep3Payouts} 
                  alt="Step 3: Dashboard payouts section showing rewards and Stripe integration"
                  className="w-full h-auto rounded-lg shadow-2xl border border-border/50"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className={`grid gap-8 text-center ${stats.monthlyActiveUsers ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {loading ? '...' : `£${(stats.totalPrizePools / 1000).toFixed(0)}k${stats.totalPrizePools >= 1000 ? '+' : ''}`}
              </div>
              <div className="text-sm text-muted-foreground">Total Prize Pools</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success mb-2">
                {loading ? '...' : `${stats.productsValidated.toLocaleString()}${stats.productsValidated >= 1000 ? '+' : ''}`}
              </div>
              <div className="text-sm text-muted-foreground">Products Validated</div>
            </div>
            {stats.monthlyActiveUsers && (
              <div>
                <div className="text-3xl font-bold text-accent mb-2">
                  {loading ? '...' : `${(stats.monthlyActiveUsers / 1000).toFixed(0)}k+`}
                </div>
                <div className="text-sm text-muted-foreground">Monthly Active Users</div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* CTA Footer */}
      <section className="py-24 bg-gradient-hero">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Validated?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of founders and users in the most rewarding validation platform
          </p>
          <Link to="/feed">
            <Button variant="accent" size="xl" className="min-w-[200px]">
              <Star className="h-5 w-5" />
              Start Exploring
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-16">
        <div className="container">
          <div className="text-center">
            {/* Logo */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-foreground">VALIDATED BY USERS</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-wrap justify-center gap-8 mb-8 text-sm">
              <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-conditions" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Use
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                Help Center
              </Link>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <p className="text-muted-foreground">
                Need help? Email us at{" "}
                <a 
                  href="mailto:support@validatedbyusers.com" 
                  className="text-primary hover:underline"
                >
                  support@validatedbyusers.com
                </a>
              </p>
            </div>

            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              © 2025 Validated by Users. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;