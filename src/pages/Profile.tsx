import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { 
  Trophy, 
  MessageCircle, 
  TrendingUp, 
  Award,
  Calendar,
  Coins,
  Star,
  History,
  Edit,
  Save,
  X
} from "lucide-react";

// Mock user data
const mockUser = {
  firstName: "Alex",
  lastName: "Thompson", 
  email: "alex@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex-profile",
  joinDate: "March 2024",
  totalEntries: 23,
  totalWinnings: 87.50,
  activePools: 5,
  totalFeedback: 23
};

// Mock activity data
const mockActivity = [
  {
    id: "1",
    type: "comment",
    title: "EcoTrack - Personal Carbon Footprint App",
    reward: "£250 Pool Entry",
    date: "2 hours ago",
    status: "pending"
  },
  {
    id: "2",
    type: "win",
    title: "DevSync - Real-time Code Collaboration", 
    reward: "£67.50 Won",
    date: "3 days ago",
    status: "completed"
  },
  {
    id: "3",
    type: "comment",
    title: "MindfulAI - Mental Health Companion",
    reward: "£100 Pool Entry",
    date: "5 days ago", 
    status: "pending"
  },
  {
    id: "4",
    type: "boost",
    title: "InvestWise - Beginner-Friendly Trading",
    reward: "+3 Bonus Entries",
    date: "1 week ago",
    status: "completed"
  }
];

const mockParticipations = [
  {
    id: "1",
    title: "EcoTrack - Personal Carbon Footprint App",
    category: "Environment",
    prizePool: 250,
    entries: 1,
    status: "Active",
    timeLeft: "2 days left"
  },
  {
    id: "2",
    title: "MindfulAI - Mental Health Companion", 
    category: "Health & Wellness",
    prizePool: 100,
    entries: 2,
    status: "Active", 
    timeLeft: "1 day left"
  },
  {
    id: "3",
    title: "LocalConnect - Neighborhood Community Hub",
    category: "Social",
    prizePool: 75,
    entries: 1,
    status: "Active",
    timeLeft: "3 days left"
  }
];

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    email: mockUser.email
  });

  const handleSave = () => {
    // In a real app, this would make an API call to update user info
    toast({
      title: "Profile updated",
      description: "Your profile information has been successfully updated.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setUserInfo({
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      email: mockUser.email
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <img 
            src={mockUser.avatar} 
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
                  onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                />
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
                  Joined {mockUser.joinDate}
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
                £{mockUser.totalWinnings.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Total Winnings</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-card shadow-sm text-center">
            <CardContent className="p-6">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground mb-1">
                {mockUser.totalEntries}
              </div>
              <div className="text-sm text-muted-foreground">Total Entries</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-card shadow-sm text-center">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground mb-1">
                {mockUser.activePools}
              </div>
              <div className="text-sm text-muted-foreground">Active Pools</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-card shadow-sm text-center">
            <CardContent className="p-6">
              <Award className="h-8 w-8 text-warning mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground mb-1">
                {mockUser.totalFeedback}
              </div>
              <div className="text-sm text-muted-foreground">Feedback Given</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Content Tabs */}
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
            <TabsTrigger value="activity">
              <History className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="participations">
              <Trophy className="h-4 w-4 mr-2" />
              Active Pools
            </TabsTrigger>
            <TabsTrigger value="wallet">
              <Coins className="h-4 w-4 mr-2" />
              Wallet
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity" className="space-y-4">
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
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
                    <div className="text-right">
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
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="participations" className="space-y-4">
            <div className="grid gap-4">
              {mockParticipations.map((participation) => (
                <Card key={participation.id} className="border-0 bg-gradient-card shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                        {participation.category}
                      </Badge>
                      <div className="text-sm text-muted-foreground">{participation.timeLeft}</div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {participation.title}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-xl font-bold text-success">
                            £{participation.prizePool}
                          </div>
                          <div className="text-xs text-muted-foreground">Prize Pool</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-primary">
                            {participation.entries}
                          </div>
                          <div className="text-xs text-muted-foreground">Your Entries</div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="wallet" className="space-y-4">
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardHeader>
                <CardTitle>Prize Wallet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-8">
                  <div className="text-4xl font-bold text-success mb-2">
                    £{mockUser.totalWinnings.toFixed(2)}
                  </div>
                  <div className="text-muted-foreground">Available Balance</div>
                </div>
                
                <div className="space-y-4">
                  <Button variant="hero" size="lg" className="w-full">
                    <Coins className="h-4 w-4" />
                    Withdraw Funds
                  </Button>
                  <Button variant="outline" size="lg" className="w-full">
                    View Transaction History
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Pending Winnings</h4>
                  <p className="text-sm text-muted-foreground">
                    You have £45.00 in pending winnings from active prize draws that will be available once the rounds conclude.
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