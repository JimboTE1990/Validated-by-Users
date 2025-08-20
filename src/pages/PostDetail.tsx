import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import { 
  Trophy, 
  Clock, 
  MessageCircle, 
  ThumbsUp, 
  Star, 
  Send,
  TrendingUp,
  Users
} from "lucide-react";

// Mock post data
const mockPost = {
  id: "1",
  title: "EcoTrack - Personal Carbon Footprint App",
  description: "A sleek mobile app that helps users track their daily carbon footprint through smart integrations with transport, energy, and shopping habits. Our goal is to make environmental awareness accessible and actionable for everyone.",
  fullDescription: "EcoTrack is designed to be the most user-friendly carbon tracking app on the market. We integrate with popular transport apps, energy providers, and shopping platforms to automatically calculate your environmental impact. The app features beautiful visualizations, personalized recommendations, and social challenges to make sustainability engaging and fun.",
  prizePool: 250,
  timeLeft: "2 days, 14 hours",
  commentCount: 47,
  category: "Environment",
  authorName: "Sarah Chen",
  authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  entries: 47,
  maxEntries: 100
};

// Mock comments
const mockComments = [
  {
    id: "1",
    user: "Alex Thompson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex-t",
    comment: "Love the concept! The automatic tracking feature would be a game-changer. Have you considered partnering with public transport apps for more accurate data?",
    likes: 12,
    boosted: true,
    timestamp: "2 hours ago"
  },
  {
    id: "2", 
    user: "Maria Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
    comment: "This addresses a real problem. The social challenges aspect could really drive engagement. What about gamification with rewards for hitting eco-friendly milestones?",
    likes: 8,
    boosted: true,
    timestamp: "4 hours ago"
  },
  {
    id: "3",
    user: "James Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
    comment: "Great initiative! Would be helpful to see comparisons with local/national averages. Also consider adding tips for reducing footprint based on user's specific patterns.",
    likes: 6,
    boosted: false,
    timestamp: "6 hours ago"
  }
];

const PostDetail = () => {
  const { id } = useParams();
  const [feedback, setFeedback] = useState("");
  const [userEntries, setUserEntries] = useState(0);

  const handleSubmitFeedback = () => {
    if (feedback.trim()) {
      setUserEntries(prev => prev + 1);
      setFeedback("");
      // Here you would normally submit to backend
    }
  };

  const progressPercentage = (mockPost.entries / mockPost.maxEntries) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Header */}
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                    {mockPost.category}
                  </Badge>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{mockPost.timeLeft}</span>
                  </div>
                </div>
                
                <CardTitle className="text-3xl font-bold text-foreground mb-4">
                  {mockPost.title}
                </CardTitle>
                
                <div className="flex items-center space-x-4">
                  <img 
                    src={mockPost.authorAvatar} 
                    alt={mockPost.authorName}
                    className="h-10 w-10 rounded-full border-2 border-primary/20"
                  />
                  <div>
                    <div className="font-semibold text-foreground">{mockPost.authorName}</div>
                    <div className="text-sm text-muted-foreground">Founder</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {mockPost.fullDescription}
                </p>
                
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success mb-1">
                      £{mockPost.prizePool.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Prize Pool</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {mockPost.commentCount}
                    </div>
                    <div className="text-sm text-muted-foreground">Entries</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Comments Section */}
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Feedback & Entries ({mockComments.length})
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {mockComments.map((comment) => (
                  <div key={comment.id} className="border-b border-border/50 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={comment.avatar} 
                        alt={comment.user}
                        className="h-8 w-8 rounded-full border border-border/50"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-foreground">{comment.user}</span>
                          {comment.boosted && (
                            <Badge variant="secondary" className="bg-accent/10 text-accent border-0 text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Boosted
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>
                        <p className="text-muted-foreground mb-3 text-sm leading-relaxed">
                          {comment.comment}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            {comment.likes}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Entry Status */}
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Your Entry Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-primary mb-2">{userEntries}</div>
                  <div className="text-sm text-muted-foreground">Your Entries</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Draw Progress</span>
                    <span className="text-foreground">{mockPost.entries}/{mockPost.maxEntries}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
                
                <Button 
                  variant="prize" 
                  size="lg" 
                  className="w-full mt-6"
                  onClick={() => document.getElementById('feedback-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Trophy className="h-4 w-4" />
                  Enter Draw
                </Button>
              </CardContent>
            </Card>
            
            {/* Feedback Form */}
            <Card id="feedback-form" className="border-0 bg-gradient-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Leave Feedback</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Share your thoughts to automatically enter the prize draw!
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="What do you think about this product? Share your honest feedback..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                  <Button 
                    onClick={handleSubmitFeedback}
                    disabled={!feedback.trim()}
                    className="w-full"
                    variant="hero"
                  >
                    <Send className="h-4 w-4" />
                    Submit Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Stats */}
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Round Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Participants</span>
                  </div>
                  <span className="font-semibold text-foreground">{mockPost.entries}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Engagement</span>
                  </div>
                  <span className="font-semibold text-success">High</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Boosted Comments</span>
                  </div>
                  <span className="font-semibold text-accent">2</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;