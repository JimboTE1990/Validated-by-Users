import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, Shield, Trophy } from "lucide-react";
import Header from "@/components/Header";
import { useEffect, useState } from "react";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { totalCost = 0, prizePool = 0, adminFee = 0 } = location.state || {};

  useEffect(() => {
    // Redirect to create post if no state is provided
    if (!location.state) {
      navigate('/create-post');
    }
  }, [location.state, navigate]);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/payment-success');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Post Details
            </Button>
            
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Complete Your Payment
            </h1>
            <p className="text-muted-foreground">
              Secure payment for your feedback request
            </p>
          </div>

          <div className="grid gap-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Prize Pool</span>
                  <span className="font-medium">£{prizePool.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Admin Fee (15%)</span>
                  <span>£{adminFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">£{totalCost.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 p-4 rounded-lg text-center">
                  <Shield className="h-8 w-8 mx-auto text-success mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">
                    This is a demo checkout. In production, this would integrate with Stripe for secure payments.
                  </p>
                  
                  <Button 
                    onClick={handlePayment}
                    disabled={isProcessing}
                    variant="hero"
                    size="lg"
                    className="w-full"
                  >
                    {isProcessing ? (
                      "Processing Payment..."
                    ) : (
                      `Pay £${totalCost.toFixed(2)}`
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <div className="text-center text-xs text-muted-foreground">
              <Shield className="h-4 w-4 mx-auto mb-1" />
              Your payment is secured with industry-standard encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;