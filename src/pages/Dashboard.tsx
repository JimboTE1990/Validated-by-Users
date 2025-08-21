import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Zap, Plus, Search, TrendingUp, Gift } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

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

  // Mock data for demonstration
  const recentPosts = [
    {
      id: 1,
      title: "AI-Powered Task Manager",
      company: "ProductCorp",
      prizePool: 5000,
      entries: 342,
      timeLeft: "5 days",
      category: "Productivity"
    },
    {
      id: 2,
      title: "Sustainable Fashion App",
      company: "EcoWear",
      prizePool: 3500,
      entries: 198,
      timeLeft: "12 days",
      category: "Lifestyle"
    },
    {
      id: 3,
      title: "Fitness Tracking Widget",
      company: "HealthTech",
      prizePool: 2000,
      entries: 156,
      timeLeft: "8 days",
      category: "Health"
    }
  ];

  const stats = [
    {
      title: "Total Earnings",
      value: "$1,247",
      icon: Trophy,
      trend: "+12%"
    },
    {
      title: "Feedback Given",
      value: "23",
      icon: Users,
      trend: "+3"
    },
    {
      title: "Active Entries",
      value: "5",
      icon: Zap,
      trend: "2 new"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {userEmail.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Ready to discover new products and earn rewards for your feedback?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-green-600">{stat.trend}</p>
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

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
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

        {/* Recent Prize Pools */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trending Prize Pools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{post.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{post.company}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Gift className="h-3 w-3" />
                        ${post.prizePool.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {post.entries} entries
                      </span>
                      <span>{post.timeLeft} left</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/post/${post.id}`}>View Details</Link>
                  </Button>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Button variant="ghost" asChild>
                <Link to="/feed">View All Prize Pools →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;