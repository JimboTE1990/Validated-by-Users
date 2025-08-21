import Header from "@/components/Header";
import { HelpCircle, DollarSign, Edit, Mail } from "lucide-react";

const Help = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Help Center</h1>
          
          <div className="bg-card border rounded-lg p-8">
            <p className="text-lg text-muted-foreground mb-8 text-center">
              Welcome to the Help Center!<br />
              Here you'll find answers to common questions:
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">How does validation work?</h3>
                  <p className="text-muted-foreground">Post your idea, set your validation criteria, and get structured feedback from real users.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <DollarSign className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">What does it cost?</h3>
                  <p className="text-muted-foreground">Validation rounds have a small entry fee that helps fund user rewards.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Edit className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">How do I withdraw my idea?</h3>
                  <p className="text-muted-foreground">You can delete or edit your submissions anytime.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Need more help?</h3>
                  <p className="text-muted-foreground">
                    Email us at{" "}
                    <a 
                      href="mailto:support@validatedbyusers.com" 
                      className="text-primary hover:underline"
                    >
                      support@validatedbyusers.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Help;