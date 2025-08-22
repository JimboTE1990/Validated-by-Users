import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { 
  Trophy, 
  MessageCircle, 
  TrendingUp, 
  Plus,
  Search,
  Clock,
  Users,
  DollarSign,
  ChevronRight,
  Star,
  Award,
  History,
  Coins,
  ExternalLink,
  Eye,
  CheckCircle,
  XCircle,
  CreditCard
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    const email = localStorage.getItem("userEmail");
    
    if (!isAuth) {
      navigate("/auth");
      return;
    }
    
    if (email) {
      setUserEmail(email);
    }
  }, [navigate]);

  // Comprehensive feedback and activity history
  const feedbackHistory = [
    {
      id: "1",
      type: "feedback",
      title: "EcoTrack - Personal Carbon Footprint App",
      company: "GreenTech Solutions",
      website: "https://ecotrack.com",
      prizePool: 250,
      reward: "£250 Pool Entry",
      date: "2 hours ago",
      status: "pending",
      feedback: "Great concept! I love how intuitive the carbon tracking interface is. The daily tips feature is particularly engaging and makes users feel empowered to make a difference. However, I think the app could benefit from social features - allowing users to compete with friends or family members could significantly increase engagement and retention.",
      category: "Environment",
      timeLeft: "2 days left"
    },
    {
      id: "2",
      type: "win",
      title: "DevSync - Real-time Code Collaboration", 
      company: "CodeFlow Inc",
      website: "https://devsync.io",
      prizePool: 500,
      reward: "£67.50 Won",
      date: "3 days ago",
      status: "completed",
      feedback: "This tool is a game-changer for remote development teams. The real-time collaboration features are seamless, and the conflict resolution system is brilliant. I particularly appreciate the integrated code review process. My only suggestion would be to add support for more programming languages and improve the mobile app experience.",
      category: "Developer Tools",
      timeLeft: "Completed"
    },
    {
      id: "3",
      type: "feedback",
      title: "MindfulAI - Mental Health Companion",
      company: "WellnessTech",
      website: "https://mindfulai.app",
      prizePool: 100,
      reward: "£100 Pool Entry",
      date: "5 days ago", 
      status: "pending",
      feedback: "The AI-powered mood tracking is innovative and the guided meditation sessions are high quality. The personalized recommendations based on user behavior are spot-on. However, I'd suggest adding more customization options for the interface and perhaps integrating with popular fitness trackers for a more holistic approach to mental wellness.",
      category: "Health & Wellness",
      timeLeft: "1 day left"
    },
    {
      id: "4",
      type: "boost",
      title: "InvestWise - Beginner-Friendly Trading",
      company: "FinanceFirst",
      website: "https://investwise.com",
      prizePool: 300,
      reward: "+3 Bonus Entries",
      date: "1 week ago",
      status: "completed",  
      feedback: "Excellent onboarding process for new investors! The educational content is comprehensive yet easy to understand. The paper trading feature is perfect for beginners to practice. I'd love to see more advanced charting tools and perhaps integration with more international markets.",
      category: "Finance",
      timeLeft: "Completed"
    },
    {
      id: "5",  
      type: "feedback",
      title: "LocalConnect - Neighborhood Hub",
      company: "CommunityTech",
      website: "https://localconnect.com", 
      prizePool: 150,
      reward: "£150 Pool Entry",
      date: "2 weeks ago",
      status: "pending",
      feedback: "Love the community-focused approach! The local event discovery feature works really well, and the neighborhood marketplace is intuitive. The safety features for meetups are well thought out. Could benefit from better push notification management and perhaps integration with popular calendar apps.",
      category: "Social",
      timeLeft: "5 days left"
    }
  ];

  const activePools = [
    {
      id: "1",
      title: "EcoTrack - Personal Carbon Footprint App",
      category: "Environment",
      prizePool: 250,
      entries: 1,
      status: "Active",
      timeLeft: "2 days left",
      myPosition: "Top 20%"
    },
    {
      id: "3",
      title: "MindfulAI - Mental Health Companion", 
      category: "Health & Wellness",
      prizePool: 100,
      entries: 1,
      status: "Active", 
      timeLeft: "1 day left",
      myPosition: "Top 35%"
    },
    {
      id: "5",
      title: "LocalConnect - Neighborhood Hub",
      category: "Social",
      prizePool: 150,
      entries: 1,
      status: "Active",
      timeLeft: "5 days left",
      myPosition: "Top 15%"
    }
  ];

  const stats = [
    {
      title: "Total Earnings",
      value: "£87.50",
      icon: Trophy,
      trend: "+12%",
      color: "text-success"
    },
    {
      title: "Feedback Given", 
      value: "23",
      icon: MessageCircle,
      trend: "+5",
      color: "text-primary"
    },
    {
      title: "Active Entries",
      value: "5", 
      icon: TrendingUp,
      trend: "3 ending soon",
      color: "text-accent"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {userEmail.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Track your feedback history and manage your active prize pool entries
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 bg-gradient-card shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className={`text-xs ${stat.color}`}>{stat.trend}</p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-primary text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Request Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 mb-4">
                Get valuable user feedback on your product or idea by creating a new validation request.
              </p>
              <Button 
                variant="secondary" 
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link to="/create-post">Create New Post</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Explore Prize Pools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Browse active validation requests and earn rewards by providing valuable feedback.
              </p>
              <Button variant="outline" asChild>
                <Link to="/feed">Browse All Posts</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Comprehensive Activity Tabs */}
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
            <TabsTrigger value="activity">
              <History className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="active-pools">
              <Trophy className="h-4 w-4 mr-2" />
              Active Pools  
            </TabsTrigger>
            <TabsTrigger value="payouts">
              <CreditCard className="h-4 w-4 mr-2" />
              Payouts
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity" className="space-y-4">
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {feedbackHistory.map((activity) => (
                  <Dialog key={activity.id}>
                    <DialogTrigger asChild>
                      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-4">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            activity.type === 'win' ? 'bg-success/10' : 
                            activity.type === 'boost' ? 'bg-accent/10' : 'bg-primary/10'
                          }`}>
                            {activity.type === 'win' ? (
                              <Trophy className="h-5 w-5 text-success" />
                            ) : activity.type === 'boost' ? (
                              <Star className="h-5 w-5 text-accent" />
                            ) : (
                              <MessageCircle className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-foreground text-sm">{activity.title}</div>
                            <div className="text-xs text-muted-foreground">{activity.date}</div>
                          </div>
                        </div>
                        <div className="text-right flex items-center space-x-2">
                          <div>
                            <div className={`font-semibold text-sm ${
                              activity.type === 'win' ? 'text-success' : 'text-primary'
                            }`}>
                              {activity.reward}
                            </div>
                            <Badge 
                              variant={activity.status === 'completed' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {activity.status}
                            </Badge>
                          </div>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                          <span>{activity.title}</span>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                            {activity.category}
                          </Badge>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div>
                            <p className="font-medium text-foreground">{activity.company}</p>
                            <p className="text-sm text-muted-foreground">Prize Pool: £{activity.prizePool}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={activity.website} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Visit Website
                              </a>
                            </Button>
                            <Link to={`/post/${activity.id}`}>
                              <Button size="sm">
                                View Original Post
                              </Button>
                            </Link>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Your Feedback:</h4>
                          <div className="p-4 bg-background border rounded-lg">
                            <p className="text-sm text-foreground leading-relaxed">{activity.feedback}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Submitted: {activity.date}</span>
                          <span className="text-muted-foreground">Status: {activity.timeLeft}</span>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="active-pools" className="space-y-4">
            <div className="grid gap-4">
              {activePools.map((pool) => (
                <Card key={pool.id} className="border-0 bg-gradient-card shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                        {pool.category}
                      </Badge>
                      <div className="text-sm text-muted-foreground">{pool.timeLeft}</div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {pool.title}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-xl font-bold text-success">
                            £{pool.prizePool}
                          </div>
                          <div className="text-xs text-muted-foreground">Prize Pool</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-primary">
                            {pool.entries}
                          </div>
                          <div className="text-xs text-muted-foreground">Your Entries</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-accent">
                            {pool.myPosition}
                          </div>
                          <div className="text-xs text-muted-foreground">Position</div>
                        </div>
                      </div>
                      
                      <Link to={`/post/${pool.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="payouts" className="space-y-4">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">Your Payouts</h2>
                <p className="text-muted-foreground">Rewards are securely paid out through Stripe Express.</p>
              </div>

              {/* Pending Rewards */}
              <Card className="border-0 bg-gradient-card shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Pending Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-primary mb-2">
                      £45.00
                    </div>
                    <p className="text-sm text-muted-foreground">
                      These are prize pool rewards awaiting release once rounds conclude.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Stripe Express Connection */}
              <Card className="border-0 bg-gradient-card shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Stripe Express Connection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-5 w-5 text-destructive" />
                      <div>
                        <p className="font-medium text-foreground">Not Connected</p>
                        <p className="text-sm text-muted-foreground">Set up your payout account to receive rewards</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="hero" size="lg" className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Set Up Payouts with Stripe
                  </Button>
                  
                  {/* Alternative connected state - uncomment when connected */}
                  {/* 
                  <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <div>
                        <p className="font-medium text-foreground">Connected</p>
                        <p className="text-sm text-muted-foreground">Your Stripe Express account is active</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="lg" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Go to Stripe Dashboard
                  </Button>
                  */}
                </CardContent>
              </Card>

              {/* Recent Rewards Preview */}
              <Card className="border-0 bg-gradient-card shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Recent Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground text-sm">Round 12 Prize</p>
                      <p className="text-xs text-muted-foreground">EcoTrack Validation</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-primary">£15.00</p>
                      <Badge variant="secondary" className="text-xs">Pending</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground text-sm">Round 8 Prize</p>
                      <p className="text-xs text-muted-foreground">DevSync Feedback</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-success">£67.50</p>
                      <Badge variant="default" className="text-xs">Paid</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground text-sm">Round 6 Prize</p>
                      <p className="text-xs text-muted-foreground">MindfulAI Review</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-accent">£30.00</p>
                      <Badge variant="secondary" className="text-xs">Released to Stripe</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Footer Note */}
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  All payouts are handled by Stripe Express. Validated by Users does not hold or store funds directly.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;