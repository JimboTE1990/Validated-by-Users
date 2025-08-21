import Header from "@/components/Header";
import { FileText, Users, Shield, AlertTriangle } from "lucide-react";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Terms of Use</h1>
          
          <div className="bg-card border rounded-lg p-8">
            <p className="text-lg text-muted-foreground mb-8 text-center">
              By using Validated by Users, you agree to:
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <FileText className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">Share only original content you have the right to post.</p>
              </div>
              
              <div className="flex items-start gap-4">
                <Users className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">Use the platform respectfully — no spam, harassment, or misleading submissions.</p>
              </div>
              
              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">Understand that user feedback is opinion-based and not guaranteed business advice.</p>
              </div>
              
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">We reserve the right to moderate or remove content that violates these terms.</p>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground italic">
                This is a short summary. A full legal Terms of Use template should be added for compliance.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsConditions;