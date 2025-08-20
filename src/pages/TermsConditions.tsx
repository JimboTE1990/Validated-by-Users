import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Trophy, Zap } from "lucide-react";
import Header from "@/components/Header";

const TermsConditions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, scheduleDate, scheduleTime, prizePool } = location.state || {};

  if (!formData || !prizePool) {
    navigate('/create-post');
    return null;
  }

  const adminFee = prizePool * 0.15;
  const totalCost = prizePool + adminFee;

  const engagementGuarantees = {
    10: { comments: 5, extension: "7 days" },
    25: { comments: 12, extension: "7 days" },
    50: { comments: 25, extension: "7 days" },
    100: { comments: 50, extension: "7 days" },
    250: { comments: 125, extension: "7 days" },
    500: { comments: 250, extension: "7 days" }
  };

  const prizeBreakdowns = {
    10: [{ position: "1st", amount: 10 }],
    25: [{ position: "1st", amount: 25 }],
    50: [{ position: "1st", amount: 30 }, { position: "2nd", amount: 20 }],
    100: [{ position: "1st", amount: 60 }, { position: "2nd", amount: 40 }],
    250: [{ position: "1st", amount: 150 }, { position: "2nd", amount: 75 }, { position: "3rd", amount: 25 }],
    500: [{ position: "1st", amount: 300 }, { position: "2nd", amount: 150 }, { position: "3rd", amount: 50 }]
  };

  const guarantee = engagementGuarantees[prizePool as keyof typeof engagementGuarantees];
  const breakdown = prizeBreakdowns[prizePool as keyof typeof prizeBreakdowns];

  const handleProceedToPayment = () => {
    navigate('/checkout', { 
      state: { 
        totalCost, 
        prizePool, 
        adminFee,
        formData,
        scheduleDate,
        scheduleTime
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Terms & Conditions
            </h1>
            <p className="text-muted-foreground">
              Review the engagement guarantees and prize distribution for your campaign
            </p>
          </div>

          <div className="grid gap-6">
            {/* Campaign Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Campaign Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Prize Pool</p>
                    <p className="text-2xl font-bold text-success">£{prizePool}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Cost (inc. 15% fee)</p>
                    <p className="text-2xl font-bold">£{totalCost.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Engagement Guarantee */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-warning" />
                  Minimum Engagement Guarantee
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Guaranteed Comments:</span>
                    <Badge variant="secondary">{guarantee.comments} unique comments</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Auto Extension:</span>
                    <Badge variant="outline">{guarantee.extension} if not met</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  If your post doesn't receive the minimum guaranteed engagement within the selected duration, 
                  we'll automatically extend it for an additional {guarantee.extension} at no extra cost.
                </p>
              </CardContent>
            </Card>

            {/* Prize Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-warning" />
                  Prize Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {breakdown.map((prize, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="font-semibold">{prize.position} Place</span>
                      <Badge variant="secondary" className="text-lg px-4 py-1">
                        £{prize.amount}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <p className="text-sm text-muted-foreground">
                  Winners are selected randomly from all participants, with boosted comments receiving additional entries.
                </p>
              </CardContent>
            </Card>

            {/* Boost System */}
            <Card>
              <CardHeader>
                <CardTitle>Boost System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Founder Boost Controls</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    At the end of your validation period, you can boost up to 5 exceptional comments.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Boosted comments receive 3x more entries in the prize draw
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Reward the most valuable and detailed feedback
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Encourage higher quality responses from the community
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Terms Agreement */}
            <Card>
              <CardHeader>
                <CardTitle>Important Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Prize draws are conducted fairly using random selection</li>
                  <li>• Winners are notified within 24 hours of draw completion</li>
                  <li>• Prizes are paid out within 5-7 business days</li>
                  <li>• Spam or inappropriate comments may be removed</li>
                  <li>• Posts cannot be cancelled once payment is processed</li>
                  <li>• Platform reserves the right to extend campaigns if technical issues occur</li>
                </ul>
              </CardContent>
            </Card>

            {/* Proceed Button */}
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleProceedToPayment}
                variant="hero" 
                size="lg" 
                className="min-w-[200px]"
              >
                Proceed to Payment
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;