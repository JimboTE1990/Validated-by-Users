import Header from "@/components/Header";
import { Target, Users, Lightbulb } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-foreground mb-8">About Validated by Users</h1>
          
          <div className="bg-card border rounded-lg p-8 text-left">
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                Building a startup is tough. Too often, founders spend time and money before knowing if people really want their idea.
              </p>
              
              <p>
                That's why we created Validated by Users — a simple platform to test your idea with real users, collect structured feedback, and gain confidence before you build.
              </p>
              
              <div className="flex items-center gap-3 text-primary font-semibold text-xl my-8">
                <Target className="h-6 w-6" />
                <span>Our mission: Help founders waste less time, and build things people actually want.</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">For Founders</h3>
                  <p className="text-muted-foreground text-sm">Get real validation before you build, save time and money.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Users className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">For Users</h3>
                  <p className="text-muted-foreground text-sm">Discover new products early and earn rewards for your feedback.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;