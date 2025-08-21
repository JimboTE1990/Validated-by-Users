import Header from "@/components/Header";
import { Shield, Eye, Trash2, Mail } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Privacy Policy</h1>
          
          <div className="bg-card border rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Your privacy matters to us.</h2>
            </div>
            
            <div className="space-y-6 text-muted-foreground">
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <p>We collect only the information needed to run the platform (like account details and idea submissions).</p>
              </div>
              
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <p>We never sell your data.</p>
              </div>
              
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <p>Feedback you provide may be anonymized and shown to other users for validation purposes.</p>
              </div>
              
              <div className="flex items-start gap-3">
                <Trash2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p>You can request deletion of your data anytime by emailing{" "}
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
            
            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground italic">
                For full legal terms, please expand with a standard privacy policy template.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;