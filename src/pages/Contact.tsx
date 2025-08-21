import Header from "@/components/Header";
import { Mail, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-foreground mb-8">Contact Us</h1>
          
          <div className="bg-card border rounded-lg p-8 text-left">
            <p className="text-muted-foreground text-lg mb-8">
              We'd love to hear from you! Whether you have a question, feedback, or a partnership idea, our team is here to help.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Email:</p>
                  <a 
                    href="mailto:support@validatedbyusers.com" 
                    className="text-primary hover:underline"
                  >
                    support@validatedbyusers.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Response time:</p>
                  <p className="text-muted-foreground">We usually reply within 1–2 business days.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;