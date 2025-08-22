import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { useUserActivities } from "@/hooks/useUserActivities";
import { useAuth } from "@/contexts/AuthContext";
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
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile(user?.id);
  const { activities, activePools, loading: activitiesLoading, getTimeLeft } = useUserActivities(user?.id);

  const loading = profileLoading || activitiesLoading;

  const stats = [
    {
      title: "Total Earnings",
      value: `£${profile?.total_winnings?.toFixed(2) || "0.00"}`,
      icon: Trophy,
      trend: profile?.total_winnings && profile.total_winnings > 0 ? "+Active" : "Start earning",
      color: profile?.total_winnings && profile.total_winnings > 0 ? "text-success" : "text-muted-foreground"
    },
    {
      title: "Feedback Given", 
      value: profile?.total_feedback?.toString() || "0",
      icon: MessageCircle,
      trend: profile?.total_feedback && profile.total_feedback > 0 ? `${profile.total_feedback} contribution${profile.total_feedback > 1 ? 's' : ''}` : "Give feedback",
      color: profile?.total_feedback && profile.total_feedback > 0 ? "text-primary" : "text-muted-foreground"
    },
    {
      title: "Active Entries",
      value: activePools.length.toString(), 
      icon: TrendingUp,
      trend: activePools.length > 0 ? `${activePools.length} active pool${activePools.length > 1 ? 's' : ''}` : "Join pools",
      color: activePools.length > 0 ? "text-accent" : "text-muted-foreground"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {profile?.first_name || user?.email?.split('@')[0] || 'User'}!
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
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                          <div className="h-10 w-10 bg-muted rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 bg-muted rounded w-20"></div>
                            <div className="h-6 bg-muted rounded w-16"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activities.length > 0 ? activities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        activity.activity_type === 'win' ? 'bg-success/10' : 
                        activity.activity_type === 'boost' ? 'bg-accent/10' : 'bg-primary/10'
                      }`}>
                        {activity.activity_type === 'win' ? (
                          <Trophy className="h-5 w-5 text-success" />
                        ) : activity.activity_type === 'boost' ? (
                          <Star className="h-5 w-5 text-accent" />
                        ) : (
                          <MessageCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">{activity.post.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(activity.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: new Date(activity.created_at).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold text-sm ${
                        activity.activity_type === 'win' ? 'text-success' : 
                        activity.activity_type === 'boost' ? 'text-accent' : 'text-primary'
                      }`}>
                        {activity.reward_description || 
                         (activity.activity_type === 'win' ? `£${activity.reward_amount?.toFixed(2) || '0.00'} Won` :
                          activity.activity_type === 'boost' ? '+Bonus Entries' :
                          `£${activity.post.prize_pool} Pool Entry`)}
                      </div>
                      <Badge 
                        variant={activity.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <History className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No activity yet. Start participating in validation rounds!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="active-pools" className="space-y-4">
            <div className="grid gap-4">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <Card key={i} className="border-0 bg-gradient-card shadow-sm animate-pulse">
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <div className="h-6 bg-muted rounded w-20"></div>
                            <div className="h-4 bg-muted rounded w-16"></div>
                          </div>
                          <div className="h-6 bg-muted rounded w-3/4"></div>
                          <div className="flex justify-between">
                            <div className="space-y-2">
                              <div className="h-4 bg-muted rounded w-24"></div>
                              <div className="h-4 bg-muted rounded w-20"></div>
                            </div>
                            <div className="h-9 bg-muted rounded w-24"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : activePools.length > 0 ? activePools.map((pool) => (
                <Card key={pool.id} className="border-0 bg-gradient-card shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                        {pool.category?.name || 'General'}
                      </Badge>
                      <div className="text-sm text-muted-foreground">{getTimeLeft(pool.end_date)}</div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {pool.title}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">£{pool.prize_pool}</div>
                          <div className="text-xs text-muted-foreground">Prize Pool</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-foreground">{pool.current_entries}</div>
                          <div className="text-xs text-muted-foreground">Total Entries</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-accent">Participating</div>
                          <div className="text-xs text-muted-foreground">Status</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/post/${pool.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="text-center py-8">
                  <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No active pools yet. Browse available posts to start participating!</p>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link to="/feed">Explore Posts</Link>
                  </Button>
                </div>
              )}
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
                      £{profile?.total_winnings?.toFixed(2) || "0.00"}
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
                  {loading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="space-y-2">
                              <div className="h-4 bg-muted rounded w-24"></div>
                              <div className="h-3 bg-muted rounded w-32"></div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-4 bg-muted rounded w-16"></div>
                              <div className="h-5 bg-muted rounded w-12"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : activities.filter(activity => activity.reward_amount && activity.reward_amount > 0).length > 0 ? (
                    activities
                      .filter(activity => activity.reward_amount && activity.reward_amount > 0)
                      .slice(0, 5)
                      .map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <p className="font-medium text-foreground text-sm">{activity.reward_description || 'Prize Reward'}</p>
                            <p className="text-xs text-muted-foreground">{activity.post.title}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold text-sm ${
                              activity.status === 'completed' ? 'text-success' : 
                              activity.status === 'released' ? 'text-accent' : 'text-primary'
                            }`}>
                              £{activity.reward_amount.toFixed(2)}
                            </p>
                            <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                              {activity.status === 'completed' ? 'Paid' : 
                               activity.status === 'released' ? 'Released to Stripe' : 'Pending'}
                            </Badge>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <Award className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No rewards yet. Start participating to earn rewards!</p>
                    </div>
                  )}
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