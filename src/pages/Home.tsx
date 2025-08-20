import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { ArrowRight, Trophy, Users, Zap, Star, MessageCircle, Target } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const Home = () => {
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
              Everyone wins in this gamified ecosystem of growth and discovery.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/feed">
                <Button variant="hero" size="xl" className="min-w-[200px]">
                  <Trophy className="h-5 w-5" />
                  Explore Prize Pools
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="xl" className="min-w-[200px]">
                <Users className="h-5 w-5" />
                For Founders
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
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple, gamified process that benefits everyone in the ecosystem
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  1. Founders Post
                </h3>
                <p className="text-muted-foreground">
                  Share your product, set a prize pool, and get ready for valuable feedback from real users.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  2. Users Validate
                </h3>
                <p className="text-muted-foreground">
                  Leave thoughtful feedback and automatically enter the prize draw. Better feedback = more entries.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  3. Everyone Wins
                </h3>
                <p className="text-muted-foreground">
                  Winners get rewarded, founders get validation, and great products get built.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">£127k+</div>
              <div className="text-sm text-muted-foreground">Total Prize Pools</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success mb-2">8,234</div>
              <div className="text-sm text-muted-foreground">Products Validated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">45k+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-2">96%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
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
    </div>
  );
};

export default Home;