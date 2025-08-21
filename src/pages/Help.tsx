import Header from "@/components/Header";
import { 
  HelpCircle, 
  DollarSign, 
  Edit, 
  Mail, 
  UserPlus, 
  Send, 
  Clock, 
  Users, 
  CreditCard, 
  Trash2,
  Shield,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Help = () => {
  const [openSections, setOpenSections] = useState<string[]>(["getting-started"]);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const FAQSection = ({ 
    id, 
    title, 
    icon: Icon, 
    children 
  }: { 
    id: string; 
    title: string; 
    icon: any; 
    children: React.ReactNode; 
  }) => {
    const isOpen = openSections.includes(id);
    
    return (
      <div className="bg-card border rounded-lg">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          </div>
          {isOpen ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
        
        {isOpen && (
          <div className="px-6 pb-6 border-t">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Help Center</h1>
            <p className="text-lg text-muted-foreground">
              Welcome to the Help Center! Find answers to common questions below.
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Getting Started */}
            <FAQSection id="getting-started" title="Getting Started" icon={UserPlus}>
              <div className="space-y-6 mt-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-primary" />
                    How do I create an account?
                  </h3>
                  <p className="text-muted-foreground ml-6">
                    Click "Sign Up" in the top right corner, enter your first name, last name, email, and create a secure password. 
                    You'll be ready to start validating ideas immediately!
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Send className="h-4 w-4 text-primary" />
                    How do I submit my first idea?
                  </h3>
                  <p className="text-muted-foreground ml-6">
                    Go to "Create Post" from your dashboard, describe your idea clearly, set your validation criteria, 
                    and choose your validation parameters. The clearer your description, the better feedback you'll receive.
                  </p>
                </div>
              </div>
            </FAQSection>

            {/* Validation Process */}
            <FAQSection id="validation-process" title="Validation Process" icon={HelpCircle}>
              <div className="space-y-6 mt-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary" />
                    How does validation work?
                  </h3>
                  <p className="text-muted-foreground ml-6">
                    Post your idea with clear validation criteria. Real users will review your concept and provide 
                    structured feedback based on factors like market demand, feasibility, and appeal. 
                    You'll receive actionable insights to help refine your idea.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    How long does validation take?
                  </h3>
                  <p className="text-muted-foreground ml-6">
                    Most validation rounds complete within 3-7 days, depending on your target audience size and 
                    the complexity of your idea. You'll start seeing feedback within the first 24-48 hours.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    How are results shown?
                  </h3>
                  <p className="text-muted-foreground ml-6">
                    You'll receive a comprehensive dashboard with feedback scores, written comments, demographic breakdowns, 
                    and key insights. All feedback is organized to help you make informed decisions about your idea.
                  </p>
                </div>
              </div>
            </FAQSection>

            {/* User Feedback */}
            <FAQSection id="user-feedback" title="User Feedback" icon={Users}>
              <div className="space-y-6 mt-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Who provides feedback on my ideas?
                  </h3>
                  <p className="text-muted-foreground ml-6">
                    Our community consists of verified users including potential customers, industry professionals, 
                    entrepreneurs, and early adopters. We match your idea with relevant user demographics when possible.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    How do you ensure quality feedback?
                  </h3>
                  <p className="text-muted-foreground ml-6">
                    We have quality controls including user verification, feedback scoring systems, and community moderation. 
                    Users who consistently provide helpful feedback are prioritized in our matching system.
                  </p>
                </div>
              </div>
            </FAQSection>

            {/* Accounts & Billing */}
            <FAQSection id="accounts-billing" title="Accounts & Billing" icon={CreditCard}>
              <div className="space-y-6 mt-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    What does validation cost?
                  </h3>
                  <p className="text-muted-foreground ml-6">
                    Validation rounds have a small entry fee that helps fund user rewards and maintain platform quality. 
                    Pricing varies based on validation scope and target audience size. Check our pricing page for current rates.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    Do you offer free trials or Pro plans?
                  </h3>
                  <p className="text-muted-foreground ml-6">
                    Yes! New users get their first validation round at a discounted rate. We're also developing Pro plans 
                    with additional features like advanced analytics, priority feedback, and bulk validations.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-primary" />
                    How do I cancel my account?
                  </h3>
                  <p className="text-muted-foreground ml-6">
                    You can deactivate your account anytime from your profile settings. If you need help or want to 
                    delete all your data, contact our support team at support@validatedbyusers.com.
                  </p>
                </div>
              </div>
            </FAQSection>

            {/* Privacy & Data */}
            <FAQSection id="privacy-data" title="Privacy & Data" icon={Shield}>
              <div className="space-y-6 mt-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    How do you keep my data safe?
                  </h3>
                  <p className="text-muted-foreground ml-6">
                    We use industry-standard encryption, secure servers, and strict access controls. Your ideas are only 
                    visible to validated users participating in your specific validation round. Read our full Privacy Policy for details.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Edit className="h-4 w-4 text-primary" />
                    How do I withdraw or edit my idea?
                  </h3>
                  <p className="text-muted-foreground ml-6">
                    You can edit your submissions anytime before validation begins, and delete them completely from your dashboard. 
                    Once validation is active, you can still withdraw, but users who already started may complete their feedback.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-primary" />
                    Can I delete my data?
                  </h3>
                  <p className="text-muted-foreground ml-6">
                    Absolutely. You have full control over your data. Request complete deletion anytime by emailing 
                    support@validatedbyusers.com, and we'll remove all your information within 7 business days.
                  </p>
                </div>
              </div>
            </FAQSection>
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-card border rounded-lg p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Mail className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Still need help?</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Button asChild>
              <a href="mailto:support@validatedbyusers.com">
                Contact Support
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Help;