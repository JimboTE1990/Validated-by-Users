import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { MediaUpload } from "@/components/MediaUpload";
import { ArrowRight, Trophy, Users, Zap, Star, MessageCircle, Target, ChevronDown, Lightbulb, FileText, Globe, Rocket, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useStatistics } from "@/hooks/useStatistics";
import heroImage from "@/assets/hero-image.jpg";

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
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
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
            
            {/* Quick Navigation CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
              <Button 
                variant="ghost" 
                size="lg" 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-muted-foreground hover:text-foreground"
              >
                <Zap className="h-4 w-4" />
                How It Works
              </Button>
              <Button 
                variant="ghost" 
                size="lg" 
                onClick={() => document.getElementById('best-practices')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-muted-foreground hover:text-foreground"
              >
                <Star className="h-4 w-4" />
                Best Practices
              </Button>
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
      <section id="how-it-works" className="py-24 bg-muted/30">
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
              <MediaUpload
                stepNumber={1}
                stepTitle="Step 1: Founders Post"
              />
            </div>
          </div>

          {/* Step 2 Details */}
          <div id="step-2" className={`mb-16 transition-all duration-500 ${activeStep === 2 ? 'opacity-100' : 'opacity-60'}`}>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <MediaUpload
                  stepNumber={2}
                  stepTitle="Step 2: Users Validate"
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
              <MediaUpload
                stepNumber={3}
                stepTitle="Step 3: Everyone Wins"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Real Use Case Examples */}
      <section className="py-16 bg-muted/20">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              See How Others Use It
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real founders sharing their experiences and results
            </p>
          </div>

          {/* Example Stories */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">John</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Wanted to A/B test 2 product variations. Listed for £10 due to low effort required.
                </p>
                <Badge variant="secondary" className="text-xs">A/B Testing</Badge>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-success" />
                  </div>
                  <h4 className="font-semibold text-foreground">Tim</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Needed feedback on his landing page copy and how enticing the offer was. Listed for £25.
                </p>
                <Badge variant="secondary" className="text-xs">Copy Review</Badge>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-accent" />
                  </div>
                  <h4 className="font-semibold text-foreground">Kerry</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Requested a full E2E review of her small business site, focusing on Services & Pricing pages. Listed for £250.
                </p>
                <Badge variant="secondary" className="text-xs">Full Site Review</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Comparison Table */}
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-3 font-semibold text-foreground">Name</th>
                        <th className="text-left py-3 font-semibold text-foreground">Ask</th>
                        <th className="text-left py-3 font-semibold text-foreground">Prize Pool</th>
                        <th className="text-left py-3 font-semibold text-foreground">Effort Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/30">
                        <td className="py-3 font-medium text-foreground">John</td>
                        <td className="py-3 text-muted-foreground">A/B test 2 variations</td>
                        <td className="py-3 text-primary font-medium">£10</td>
                        <td className="py-3 text-muted-foreground">Low</td>
                      </tr>
                      <tr className="border-b border-border/30">
                        <td className="py-3 font-medium text-foreground">Tim</td>
                        <td className="py-3 text-muted-foreground">Landing page copy feedback</td>
                        <td className="py-3 text-success font-medium">£25</td>
                        <td className="py-3 text-muted-foreground">Medium</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium text-foreground">Kerry</td>
                        <td className="py-3 text-muted-foreground">Full E2E site review</td>
                        <td className="py-3 text-accent font-medium">£250</td>
                        <td className="py-3 text-muted-foreground">High</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Best Practices Guide */}
      <section id="best-practices" className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Best Practices
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tips to get the most out of our validation ecosystem
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* For Requestors */}
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Rocket className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground">For Requestors</h4>
                  <Badge variant="secondary" className="text-xs">🚀 Founders & Creators</Badge>
                </div>
                
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">Be specific in your ask</span>
                      <p className="text-sm text-muted-foreground mt-1">Clear questions get better answers</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">Match prize pool to effort</span>
                      <p className="text-sm text-muted-foreground mt-1">Higher rewards for complex reviews</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">Keep it concise</span>
                      <p className="text-sm text-muted-foreground mt-1">Focused requests get more engagement</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">Boost quality comments</span>
                      <p className="text-sm text-muted-foreground mt-1">Reward detailed feedback with extra entries</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">Close the loop with participants</span>
                      <p className="text-sm text-muted-foreground mt-1">Share how you implemented their feedback</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* For Feedback Givers */}
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground">For Feedback Givers</h4>
                  <Badge variant="secondary" className="text-xs">💡 Community</Badge>
                </div>
                
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">Be constructive (explain why)</span>
                      <p className="text-sm text-muted-foreground mt-1">Share reasoning behind your feedback</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">Stick to the brief</span>
                      <p className="text-sm text-muted-foreground mt-1">Answer what the founder actually asked</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">Think like the target audience</span>
                      <p className="text-sm text-muted-foreground mt-1">Consider who would actually use this product</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">Quality feedback increases win chances</span>
                      <p className="text-sm text-muted-foreground mt-1">Detailed reviews get boosted by founders</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">Stay respectful & professional</span>
                      <p className="text-sm text-muted-foreground mt-1">Help founders improve, don't just criticize</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
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