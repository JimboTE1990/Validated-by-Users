import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Trophy, Calendar, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentVerified, setPaymentVerified] = useState<boolean | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setPaymentVerified(false);
        return;
      }
      
      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId }
        });
        
        if (error) throw error;
        
        setPaymentVerified(data.success);
        setPaymentDetails(data);
      } catch (error) {
        console.error('Payment verification error:', error);
        setPaymentVerified(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (paymentVerified === null) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <div className="w-8 h-8 bg-muted-foreground/20 rounded-full"></div>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Verifying Payment...
              </h1>
              <p className="text-muted-foreground">
                Please wait while we confirm your payment
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentVerified) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Payment Verification Failed
            </h1>
            <p className="text-muted-foreground mb-6">
              There was an issue verifying your payment. Please contact support if this persists.
            </p>
            <Link to="/checkout">
              <Button variant="outline">
                Try Again
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground">
              Your feedback request has been created successfully
            </p>
          </div>

          {paymentDetails && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Amount Paid</span>
                  <span className="font-medium">
                    £{(paymentDetails.amount / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Transaction ID</span>
                  <span className="font-mono text-sm text-muted-foreground">
                    {paymentDetails.sessionId.slice(0, 20)}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="text-success font-medium">Paid</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-lg font-semibold">
                  <Trophy className="h-5 w-5 text-primary" />
                  Prize Pool Created
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Post is now live and accepting feedback</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span>Users can start providing feedback</span>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Your post is now live! Users can provide feedback and compete for the prize pool. 
                    You'll receive email notifications for new feedback submissions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/feed">
              <Button variant="outline" size="lg">
                Browse Other Posts
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="hero" size="lg">
                View Your Posts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;