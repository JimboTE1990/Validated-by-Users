import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageCircle, TrendingUp, Trophy, CheckCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface PostCardProps {
  id: string;
  title: string;
  description: string;
  prizePool: number;
  timeLeft: string;
  commentCount: number;
  category: string;
  authorName: string;
  authorAvatar: string;
  authorId: string;
  userEntry?: {
    id: string;
    is_boosted: boolean;
  } | null;
  onEnterDraw?: (postId: string) => void;
}

const PostCard = ({ 
  id, 
  title, 
  description, 
  prizePool, 
  timeLeft, 
  commentCount, 
  category, 
  authorName,
  authorAvatar,
  authorId,
  userEntry,
  onEnterDraw
}: PostCardProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const isOwnPost = user?.id === authorId;
  
  const handleEnterDraw = async () => {
    try {
      await onEnterDraw?.(id);
      toast({
        title: "Successfully entered!",
        description: "You've entered this validation round."
      });
    } catch (error) {
      toast({
        title: "Entry failed",
        description: error instanceof Error ? error.message : "Failed to enter draw",
        variant: "destructive"
      });
    }
  };
  return (
    <Card className="group relative overflow-hidden border-0 bg-gradient-card shadow-sm hover:shadow-card-hover transition-smooth">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
            {category}
          </Badge>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{timeLeft}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-smooth">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={authorAvatar} 
              alt={authorName}
              className="h-8 w-8 rounded-full border-2 border-primary/20"
            />
            <span className="text-sm font-medium text-foreground">{authorName}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span>{commentCount}</span>
            </div>
            
            {userEntry && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-success">Entered</span>
                </div>
                {userEntry.is_boosted && (
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium text-warning">Boosted</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-success" />
            <span className="text-2xl font-bold text-success">£{prizePool.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">prize pool</span>
          </div>
          
          {userEntry ? (
            <Link to={`/post/${id}`}>
              <Button variant="outline" size="sm" className="min-w-[120px]">
                <MessageCircle className="h-4 w-4" />
                View Entry
              </Button>
            </Link>
          ) : (
            <Button 
              variant="prize" 
              size="sm" 
              className="min-w-[120px]"
              onClick={handleEnterDraw}
              disabled={isOwnPost}
            >
              <TrendingUp className="h-4 w-4" />
              {isOwnPost ? "Your Request" : "Enter Draw"}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;