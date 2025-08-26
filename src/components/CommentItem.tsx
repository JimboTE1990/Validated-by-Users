import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Zap, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReportFeedbackDialog } from "./ReportFeedbackDialog";
import { useAuth } from "@/contexts/AuthContext";

interface CommentItemProps {
  id: string;
  content: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  likes: number;
  isBoosted?: boolean;
  isPostAuthor?: boolean;
  postAuthorId?: string;
  onReport?: () => void;
}

export const CommentItem = ({
  id,
  content,
  authorName,
  authorAvatar,
  createdAt,
  likes,
  isBoosted,
  isPostAuthor,
  postAuthorId,
  onReport
}: CommentItemProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();
  
  const isCurrentUserPostAuthor = user?.id === postAuthorId;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement actual like functionality
  };

  return (
    <Card className={`${isBoosted ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={authorAvatar} />
            <AvatarFallback>
              {authorName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-sm">{authorName}</span>
              {isBoosted && (
                <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Boosted
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {formatDate(createdAt)}
              </span>
            </div>
            
            <p className="text-sm text-foreground mb-3 leading-relaxed">
              {content}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`h-8 px-2 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                >
                  <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                  {likes + (isLiked ? 1 : 0)}
                </Button>
                
                {isPostAuthor && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground hover:text-primary"
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    Boost
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                {/* Show report option only to post authors */}
                {isCurrentUserPostAuthor && (
                  <ReportFeedbackDialog
                    commentId={id}
                    onReported={onReport}
                  />
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-muted-foreground">
                      Share feedback
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-muted-foreground">
                      Copy link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};