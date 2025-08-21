import Header from "@/components/Header";
import { Shield, Database, Users, Cookie, Trash2, Mail } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Privacy Policy</h1>
          
          <div className="bg-card border rounded-lg p-8">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="h-6 w-6 text-primary" />
              <p className="text-lg text-muted-foreground">
                Your privacy matters to us. Here's how we handle your data, explained in simple terms.
              </p>
            </div>
            
            <div className="space-y-8">
              {/* What We Collect */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Database className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">What Data We Collect</h2>
                </div>
                <div className="space-y-3 text-muted-foreground ml-8">
                  <p>• <strong>Basic user information:</strong> Name, email address, and account preferences</p>
                  <p>• <strong>Submitted ideas:</strong> The startup ideas and concepts you share for validation</p>
                  <p>• <strong>Survey responses:</strong> Feedback you provide on other users' ideas</p>
                  <p>• <strong>Usage data:</strong> How you interact with our platform to help us improve</p>
                </div>
              </section>

              {/* How We Use Data */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">How We Use Your Data</h2>
                </div>
                <div className="space-y-3 text-muted-foreground ml-8">
                  <p>• <strong>Provide validation insights:</strong> Connect your ideas with relevant user feedback</p>
                  <p>• <strong>Improve our platform:</strong> Analyze usage patterns to enhance user experience</p>
                  <p>• <strong>Communication:</strong> Send important updates and respond to your questions</p>
                  <p>• <strong>Community building:</strong> Show anonymized feedback to help other users</p>
                </div>
              </section>

              {/* Data Protection */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">How We Protect Your Data</h2>
                </div>
                <div className="space-y-3 text-muted-foreground ml-8">
                  <p>• <strong>We never sell your data</strong> to third parties - your information stays with us</p>
                  <p>• <strong>Secure storage:</strong> Your data is encrypted and stored on secure servers</p>
                  <p>• <strong>Limited access:</strong> Only authorized team members can access user data</p>
                  <p>• <strong>Anonymization:</strong> Public feedback is anonymized to protect your identity</p>
                </div>
              </section>

              {/* Cookies & Analytics */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Cookie className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Cookies & Analytics</h2>
                </div>
                <div className="space-y-3 text-muted-foreground ml-8">
                  <p>• We use essential cookies to keep you logged in and remember your preferences</p>
                  <p>• Analytics help us understand how users interact with our platform</p>
                  <p>• You can disable non-essential cookies in your browser settings</p>
                </div>
              </section>

              {/* Your Rights */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Trash2 className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Your Rights</h2>
                </div>
                <div className="space-y-3 text-muted-foreground ml-8">
                  <p>• <strong>Access your data:</strong> Request a copy of all data we have about you</p>
                  <p>• <strong>Update information:</strong> Change your account details anytime in your profile</p>
                  <p>• <strong>Delete your account:</strong> Request complete removal of your data from our systems</p>
                  <p>• <strong>Data portability:</strong> Export your ideas and feedback in a standard format</p>
                </div>
              </section>

              {/* Contact */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Privacy Questions?</h2>
                </div>
                <div className="text-muted-foreground ml-8">
                  <p>
                    If you have questions about this privacy policy or want to exercise your data rights, 
                    contact us at{" "}
                    <a 
                      href="mailto:support@validatedbyusers.com" 
                      className="text-primary hover:underline"
                    >
                      support@validatedbyusers.com
                    </a>
                  </p>
                </div>
              </section>
            </div>
            
            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Last updated:</strong> This privacy policy was last updated on {new Date().toLocaleDateString()}. 
                We'll notify you of any significant changes via email.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;