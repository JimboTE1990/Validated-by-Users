import Header from "@/components/Header";
import { Target, Users, Lightbulb, Clock, DollarSign, TrendingUp, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Turning ideas into reality — backed by real users
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We believe the best ideas are built with people, not in isolation.
            </p>
          </div>
          
          <div className="space-y-12">
            {/* Story Section */}
            <div className="bg-card border rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Why We Created This Platform</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Building a startup is tough. We've seen too many founders, makers, and innovators 
                  spend months (or years) and thousands of dollars building something before ever 
                  knowing if people actually want it.
                </p>
                
                <p>
                  The traditional approach is backwards: build first, hope later. We flipped that script.
                </p>
                
                <p>
                  That's why we created Validated by Users — a simple platform where you can test your 
                  idea with real users, collect structured feedback, and gain confidence before you build.
                </p>
              </div>
              
              <div className="flex items-center gap-3 text-primary font-semibold text-2xl mt-8 p-4 bg-primary/5 rounded-lg">
                <Target className="h-8 w-8" />
                <span>Our mission: Help founders waste less time, and build things people actually want.</span>
              </div>
            </div>

            {/* Core Value */}
            <div className="bg-card border rounded-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Real User Feedback, Not Just AI Reports</h2>
                <p className="text-lg text-muted-foreground">
                  We connect you with actual humans who will give you honest, actionable insights about your idea.
                </p>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card border rounded-lg p-6 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Quick Validation</h3>
                <p className="text-sm text-muted-foreground">Get feedback in days, not months</p>
              </div>
              
              <div className="bg-card border rounded-lg p-6 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Real Insights</h3>
                <p className="text-sm text-muted-foreground">Genuine feedback from potential users</p>
              </div>
              
              <div className="bg-card border rounded-lg p-6 text-center">
                <DollarSign className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Save Money</h3>
                <p className="text-sm text-muted-foreground">Validate before investing heavily</p>
              </div>
              
              <div className="bg-card border rounded-lg p-6 text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Build Confidence</h3>
                <p className="text-sm text-muted-foreground">Make data-driven decisions</p>
              </div>
            </div>

            {/* For Founders and Users */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card border rounded-lg p-8">
                <div className="flex items-start gap-4 mb-4">
                  <Lightbulb className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">For Founders & Makers</h3>
                    <p className="text-muted-foreground">
                      Whether you're a first-time founder or a serial entrepreneur, get the validation 
                      you need to move forward with confidence. Test assumptions, refine your concept, 
                      and build something people actually want.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-8">
                <div className="flex items-start gap-4 mb-4">
                  <Users className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">For Users & Early Adopters</h3>
                    <p className="text-muted-foreground">
                      Discover exciting new products and services before they launch. Your honest feedback 
                      shapes the future of innovation, and you get rewarded for sharing your valuable insights.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Section */}
            <div className="bg-card border rounded-lg p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Community-Driven Innovation</h2>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                We believe the best ideas emerge from real conversations between creators and their future users. 
                Join a community that's passionate about building better products together.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;