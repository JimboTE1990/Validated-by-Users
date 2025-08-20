import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageCircle, TrendingUp, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

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
  authorAvatar 
}: PostCardProps) => {
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
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>{commentCount} entries</span>
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
          
          <Link to={`/post/${id}`}>
            <Button variant="prize" size="sm" className="min-w-[120px]">
              <TrendingUp className="h-4 w-4" />
              Enter Draw
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;