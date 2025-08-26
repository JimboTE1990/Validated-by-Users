import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { usePost } from "@/hooks/usePosts";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useModeration } from "@/hooks/useModeration";
import { 
  Trophy, 
  Clock, 
  MessageCircle, 
  Star, 
  Send,
  TrendingUp,
  Users,
  CheckCircle,
  Globe,
  ExternalLink,
  ImageIcon,
  Zap
} from "lucide-react";

const getTimeLeft = (endDate: string) => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return "Ended";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours > 1 ? 's' : ''} left`;
  } else {
    return `${hours} hour${hours > 1 ? 's' : ''} left`;
  }
};

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

const PostDetail = () => {
  const { id } = useParams();
  const [feedback, setFeedback] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [boostedComments, setBoostedComments] = useState<Set<string>>(new Set());
  
  const { post, loading, error, refetch } = usePost(id || '');
  const { user } = useAuth();
  const { toast } = useToast();
  const { moderateContent, checkUserStatus, isProcessing } = useModeration();

  const handleSubmitFeedback = async () => {
    if (!feedback.trim() || !agreedToTerms || !user || !post) return;
    
    setIsSubmitting(true);
    
    try {
      // Check if user is suspended before proceeding
      const { isSuspended } = await checkUserStatus();
      
      if (isSuspended) {
        toast({
          title: "Account Suspended",
          description: "🚫 Your account is suspended. Contact support if you believe this is an error.",
          variant: "destructive"
        });
        return;
      }

      // Run moderation on the feedback content
      const moderationResult = await moderateContent(feedback, post.id);
      
      if (!moderationResult || moderationResult.classification === 'spam') {
        // Moderation failed or content is spam - don't insert comment
        // The moderation hook already shows the appropriate warning toast
        return;
      }

      // Content passed moderation, proceed with submission
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: post.id,
          user_id: user.id,
          content: feedback,
          likes: 0,
          is_boosted: false
        });

      if (error) throw error;

      // Create user activity for feedback submission
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          post_id: post.id,
          activity_type: 'feedback_submission',
          reward_description: 'Feedback submitted for validation',
          reward_amount: 0,
          status: 'pending'
        });

      setHasSubmitted(true);
      setFeedback("");
      setAgreedToTerms(false);
      refetch();
      
      toast({
        title: "Feedback Submitted!",
        description: "Your feedback has been submitted and you've been entered into the draw.",
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBoostComment = async (commentId: string) => {
    if (!user || !post || post.author_id !== user.id) return;
    
    // Check if already boosted 5 comments
    if (boostedComments.size >= 5) {
      toast({
        title: "Boost Limit Reached",
        description: "You can only boost up to 5 comments per post.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('comments')
        .update({ is_boosted: true, likes: 3 })
        .eq('id', commentId);

      if (error) throw error;

      setBoostedComments(prev => new Set([...prev, commentId]));
      refetch();
      
      toast({
        title: "Comment Boosted!",
        description: "This comment now has +3 entries in the draw.",
      });
    } catch (error) {
      console.error('Error boosting comment:', error);
      toast({
        title: "Error",
        description: "Failed to boost comment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const isPostAuthor = user && post && post.author_id === user.id;
  const canComment = user && !isPostAuthor;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="text-center">
            <div className="text-lg text-muted-foreground">Loading post...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="text-center">
            <div className="text-lg text-destructive">
              {error || 'Post not found'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = (post.current_entries / post.max_entries) * 100;

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
                    {post.category.name}
                  </Badge>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{getTimeLeft(post.end_date)}</span>
                  </div>
                </div>
                
                <CardTitle className="text-3xl font-bold text-foreground mb-4">
                  {post.title}
                </CardTitle>
                
                <div className="flex items-center space-x-4">
                  <img 
                    src={post.author.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.first_name}`}
                    alt={`${post.author.first_name} ${post.author.last_name}`}
                    className="h-10 w-10 rounded-full border-2 border-primary/20"
                  />
                  <div>
                    <div className="font-semibold text-foreground">
                      {post.author.first_name} {post.author.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">Founder</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {post.full_description || post.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success mb-1">
                      £{post.prize_pool.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Prize Pool</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {post.current_entries}
                    </div>
                    <div className="text-sm text-muted-foreground">Entries</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* App Link and Media */}
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">App & Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* App Link */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Try the App</h3>
                  {post.product_link ? (
                    <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                      <Globe className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <a 
                          href={post.product_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 transition-colors font-medium break-all"
                        >
                          {post.product_link}
                        </a>
                        <p className="text-sm text-muted-foreground mt-1">
                          Click to open the app in a new tab
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg border bg-muted/30 text-center">
                      <p className="text-sm text-muted-foreground">No product link available</p>
                    </div>
                  )}
                </div>

                {/* Images/Media */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Product Images</h3>
                  {post.images && post.images.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {post.images.map((image) => (
                        <div key={image.id} className="aspect-video rounded-lg border overflow-hidden">
                          <img 
                            src={image.image_url} 
                            alt={`Product ${image.image_type}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="aspect-video rounded-lg border-2 border-dashed border-border bg-muted/50 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">No images available</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Comments Section */}
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Feedback & Entries ({post.comments?.length || 0})
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment) => (
                    <div key={comment.id} className="border-b border-border/50 pb-6 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <img 
                          src={comment.user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user.first_name}`}
                          alt={`${comment.user.first_name} ${comment.user.last_name}`}
                          className="h-8 w-8 rounded-full border border-border/50"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-foreground">
                                {comment.user.first_name} {comment.user.last_name}
                              </span>
                              {comment.is_boosted && (
                                <Badge variant="secondary" className="bg-accent/10 text-accent border-0 text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Boosted (+3 entries)
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {getRelativeTime(comment.created_at)}
                              </span>
                            </div>
                            {isPostAuthor && !comment.is_boosted && boostedComments.size < 5 && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleBoostComment(comment.id)}
                                className="text-xs"
                              >
                                <Zap className="h-3 w-3 mr-1" />
                                Boost
                              </Button>
                            )}
                          </div>
                          <p className="text-muted-foreground mb-3 text-sm leading-relaxed">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No feedback yet. Be the first to comment!</p>
                  </div>
                )}
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
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium text-foreground">Entered</span>
                  <Badge variant={hasSubmitted ? "default" : "secondary"} className="text-xs">
                    {hasSubmitted ? "Yes" : "No"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium text-foreground">Boosted</span>
                  <Badge variant={hasSubmitted ? "secondary" : "secondary"} className={hasSubmitted ? "bg-accent/10 text-accent border-0" : ""}>
                    {hasSubmitted ? "Yes" : "No"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            {/* Feedback Form - Only show if user can comment */}
            {canComment && (
              <Card id="feedback-form" className="border-0 bg-gradient-card shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Leave Feedback
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Share your thoughts to automatically enter the prize draw!
                  </p>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                  {/* Feedback Guidelines */}
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Feedback Guidelines
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Share constructive, honest feedback</li>
                      <li>• Quality feedback may get boosted for extra entries</li>
                      <li>• No spam or promotional content</li>
                      <li>• Be respectful and professional</li>
                    </ul>
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-start space-x-3 p-3 bg-accent/5 rounded-lg border border-accent/20">
                    <input
                      type="checkbox"
                      id="terms-agreement"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-border/50 text-primary focus:ring-primary"
                    />
                    <label htmlFor="terms-agreement" className="text-sm text-muted-foreground leading-relaxed">
                      I agree to provide quality feedback following the guidelines above and understand that 
                      my submission will be reviewed by the founder.
                    </label>
                  </div>

                  <Textarea
                    placeholder={hasSubmitted 
                      ? "Edit your feedback..." 
                      : "What do you think about this product? Share your honest feedback..."
                    }
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[120px] resize-none"
                    disabled={!agreedToTerms}
                  />
                   <Button 
                     onClick={handleSubmitFeedback}
                     disabled={!feedback.trim() || !agreedToTerms || isSubmitting || isProcessing}
                     className="w-full"
                     variant="hero"
                   >
                     <Send className="h-4 w-4" />
                     {isSubmitting || isProcessing ? "Processing..." : "Submit Feedback and Enter Draw"}
                   </Button>
                </div>
              </CardContent>
            </Card>
            )}

            {/* Post Author Info - Show if user is the author */}
            {isPostAuthor && (
              <Card className="border-0 bg-gradient-card shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="h-5 w-5 text-accent" />
                    Post Author Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium text-foreground">Boosts Used</span>
                    <Badge variant="secondary" className="text-xs">
                      {boostedComments.size}/5
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You can boost up to 5 comments to give them +3 entries each. As the post author, you cannot leave feedback on your own post.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Not Logged In Message */}
            {!user && (
              <Card className="border-0 bg-gradient-card shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Join the Discussion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sign in to leave feedback and enter the prize draw!
                  </p>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Stats */}
            <Card className="border-0 bg-gradient-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Key Post Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Participants</span>
                  </div>
                  <span className="font-semibold text-foreground">{post.current_entries}</span>
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
                  <span className="font-semibold text-accent">
                    {post.comments?.filter(c => c.is_boosted).length || 0}
                  </span>
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