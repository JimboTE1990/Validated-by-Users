import Header from "@/components/Header";
import { FileText, Users, Shield, AlertTriangle, Scale, UserCheck, Copyright } from "lucide-react";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Terms of Use</h1>
          
          <div className="bg-card border rounded-lg p-8">
            <p className="text-lg text-muted-foreground mb-8 text-center">
              Welcome to Validated by Users! These terms are written in plain English to help you understand your rights and responsibilities.
            </p>
            
            <div className="space-y-8">
              {/* What We Do */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">What Validated by Users Does</h2>
                </div>
                <div className="text-muted-foreground ml-8 space-y-2">
                  <p>• We help validate startup ideas with real user feedback</p>
                  <p>• We provide insights and opinions, <strong>not professional business or financial advice</strong></p>
                  <p>• We connect founders with users willing to provide honest feedback</p>
                  <p>• We cannot guarantee commercial success based on validation results</p>
                </div>
              </section>

              {/* User Responsibilities */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Your Responsibilities</h2>
                </div>
                <div className="text-muted-foreground ml-8 space-y-2">
                  <p>• <strong>Provide honest feedback</strong> when reviewing other users' ideas</p>
                  <p>• <strong>Share only original content</strong> you have the right to post</p>
                  <p>• <strong>Use respectful language</strong> — no spam, harassment, or abusive behavior</p>
                  <p>• <strong>Don't submit harmful content</strong> including illegal, offensive, or infringing material</p>
                  <p>• <strong>Keep your account secure</strong> and don't share login credentials</p>
                </div>
              </section>

              {/* Age Requirement */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <UserCheck className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Account Eligibility</h2>
                </div>
                <div className="text-muted-foreground ml-8">
                  <p>You must be at least <strong>16 years old</strong> to use Validated by Users. By creating an account, you confirm you meet this requirement.</p>
                </div>
              </section>

              {/* Disclaimers */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Important Disclaimers</h2>
                </div>
                <div className="text-muted-foreground ml-8 space-y-2">
                  <p>• <strong>We can't guarantee business success</strong> — validation is just one step in building a successful business</p>
                  <p>• <strong>Feedback is opinion-based</strong> and represents individual user views, not market certainty</p>
                  <p>• <strong>Use results wisely</strong> — combine our insights with your own research and professional advice</p>
                  <p>• <strong>No warranties</strong> — we provide the platform "as is" without guarantees of specific outcomes</p>
                </div>
              </section>

              {/* Liability Limits */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Limits of Liability</h2>
                </div>
                <div className="text-muted-foreground ml-8 space-y-2">
                  <p>• <strong>We're not responsible for business outcomes</strong> based on validation results</p>
                  <p>• <strong>Users are responsible for their own business decisions</strong> and investments</p>
                  <p>• <strong>Our liability is limited</strong> to the amount you've paid for our services</p>
                  <p>• <strong>We're not liable for indirect damages</strong> like lost profits or missed opportunities</p>
                </div>
              </section>

              {/* Intellectual Property */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Copyright className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Intellectual Property</h2>
                </div>
                <div className="text-muted-foreground ml-8 space-y-2">
                  <p>• <strong>You keep ownership</strong> of your ideas and content</p>
                  <p>• <strong>You grant us permission</strong> to process and display your ideas within our platform</p>
                  <p>• <strong>We can show anonymized feedback</strong> to help other users understand validation quality</p>
                  <p>• <strong>Don't post content you don't own</strong> or lack permission to share</p>
                </div>
              </section>

              {/* Account Actions */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Account Moderation</h2>
                </div>
                <div className="text-muted-foreground ml-8 space-y-2">
                  <p>• <strong>We reserve the right</strong> to suspend or remove accounts that violate these terms</p>
                  <p>• <strong>We can moderate content</strong> that doesn't meet our community guidelines</p>
                  <p>• <strong>Repeated violations</strong> may result in permanent account closure</p>
                  <p>• <strong>Appeals process:</strong> Contact support if you believe we made an error</p>
                </div>
              </section>
            </div>
            
            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is a simplified summary of our terms. A comprehensive legal Terms of Use document 
                should be implemented for full compliance. Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsConditions;