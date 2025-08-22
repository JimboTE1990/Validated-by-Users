import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { 
  Trophy, 
  MessageCircle, 
  TrendingUp, 
  Award,
  Calendar,
  ExternalLink,
  Star,
  History,
  Edit,
  Save,
  X
} from "lucide-react";

const getRelativeTime = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
};

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  // Get current user and fetch profile
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { profile, activities, loading, error, updateProfile } = useProfile(currentUser?.id);

  // Get current user on component mount
  useState(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (user && profile) {
        setUserInfo({
          firstName: profile.first_name || "",
          lastName: profile.last_name || "",
          email: user.email || ""
        });
      }
    };
    getCurrentUser();
  });

  const handleSave = async () => {
    try {
      await updateProfile({
        first_name: userInfo.firstName,
        last_name: userInfo.lastName
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    if (profile) {
      setUserInfo({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: currentUser?.email || ""
      });
    }
    setIsEditing(false);
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="text-center">
            <div className="text-lg text-muted-foreground">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="text-center">
            <div className="text-lg text-destructive">
              Please log in to view your profile
            </div>
            <Button variant="outline" className="mt-4" onClick={() => window.location.href = '/auth'}>
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <img 
            src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.first_name}`}
            alt={`${userInfo.firstName} ${userInfo.lastName}`}
            className="h-24 w-24 rounded-full border-4 border-primary/20 mx-auto mb-4"
          />
          
          {isEditing ? (
            <div className="max-w-md mx-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={userInfo.firstName}
                    onChange={(e) => setUserInfo({...userInfo, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={userInfo.lastName}
                    onChange={(e) => setUserInfo({...userInfo, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userInfo.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed from profile settings
                </p>
              </div>
              <div className="flex space-x-2 justify-center">
                <Button onClick={handleSave} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {userInfo.firstName} {userInfo.lastName}
              </h1>
              <p className="text-muted-foreground mb-4">{userInfo.email}</p>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                  <Calendar className="h-3 w-3 mr-1" />
                  Joined {new Date(profile.created_at).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </Badge>
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </>
          )}
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 bg-gradient-card shadow-sm text-center">
            <CardContent className="p-6">
              <Trophy className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground mb-1">
                £{profile.total_winnings.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Total Winnings</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-card shadow-sm text-center">
            <CardContent className="p-6">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground mb-1">
                {profile.total_entries}
              </div>
              <div className="text-sm text-muted-foreground">Total Entries</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-card shadow-sm text-center">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground mb-1">
                0
              </div>
              <div className="text-sm text-muted-foreground">Active Pools</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-card shadow-sm text-center">
            <CardContent className="p-6">
              <Award className="h-8 w-8 text-warning mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground mb-1">
                {profile.total_feedback}
              </div>
              <div className="text-sm text-muted-foreground">Feedback Given</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Content Tabs */}
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="activity">
              <History className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="payouts">
              <ExternalLink className="h-4 w-4 mr-2" />
              Payouts
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity" className="space-y-4">
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity) => (
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
                          <div className="text-xs text-muted-foreground">{getRelativeTime(activity.created_at)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold text-sm ${
                          activity.activity_type === 'win' ? 'text-success' : 'text-primary'
                        }`}>
                          {activity.reward_description || `${activity.activity_type} activity`}
                        </div>
                        <Badge 
                          variant={activity.status === 'completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <History className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No activity yet. Start participating in validation rounds!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payouts" className="space-y-4">
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardHeader>
                <CardTitle>Your Payouts</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Rewards are securely paid out through Stripe Express.
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-8">
                  <div className="text-4xl font-bold text-success mb-2">
                    £{profile.total_winnings.toFixed(2)}
                  </div>
                  <div className="text-muted-foreground">Pending Rewards</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    These are prize pool rewards awaiting release once rounds conclude.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Stripe Express Status</span>
                      <Badge variant="secondary">❌ Not Connected</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                      Connect your Stripe Express account to receive payouts
                    </p>
                    <Button variant="hero" size="sm" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Set Up Payouts with Stripe
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground text-center">
                    All payouts are handled by Stripe Express. Validated with Users does not hold or store funds directly.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;