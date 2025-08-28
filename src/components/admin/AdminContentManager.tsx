import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MediaUpload } from "@/components/MediaUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Pin, 
  Minus, 
  Eye, 
  Edit3, 
  Trash2,
  Image,
  Video,
  FileText,
  Star,
  TrendingUp,
  Clock,
  Users
} from "lucide-react";

export const AdminContentManager = () => {
  const [editingContent, setEditingContent] = useState<any>(null);
  const { toast } = useToast();

  // Mock featured content - would come from API
  const featuredContent = [
    {
      id: "1",
      type: "post",
      title: "Revolutionary AI SaaS Platform",
      description: "Get feedback on our new AI-powered analytics tool",
      author: "Sarah Chen",
      prizePool: 250,
      isPinned: true,
      views: 1247,
      comments: 89,
      createdAt: "2025-01-15"
    },
    {
      id: "2",
      type: "post", 
      title: "Mobile App UI/UX Redesign",
      description: "Seeking user feedback on our app's new design direction",
      author: "Mike Johnson",
      prizePool: 150,
      isPinned: false,
      views: 892,
      comments: 67,
      createdAt: "2025-01-14"
    }
  ];

  const handlePinContent = (contentId: string, isPinned: boolean) => {
    // Would make API call here
    toast({
      title: isPinned ? "Content Unpinned" : "Content Pinned",
      description: isPinned ? "Content removed from featured section" : "Content added to featured section"
    });
  };

  const handleRemoveContent = (contentId: string) => {
    // Would make API call here
    toast({
      title: "Content Removed",
      description: "Content has been removed from the platform",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-8">
      {/* Media Management */}
      <Card className="border-0 bg-gradient-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Homepage Media Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Upload and manage images/videos for the homepage "How It Works" sections.
          </p>
          
          <div className="grid gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Step 1: Founders Post</h4>
              <MediaUpload stepNumber={1} stepTitle="Step 1: Founders Post" />
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Step 2: Users Validate</h4>
              <MediaUpload stepNumber={2} stepTitle="Step 2: Users Validate" />
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Step 3: Everyone Wins</h4>
              <MediaUpload stepNumber={3} stepTitle="Step 3: Everyone Wins" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Content Management */}
      <Card className="border-0 bg-gradient-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Featured Content Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Pin high-quality posts to the featured section and manage platform content.
          </p>
          
          <div className="space-y-4">
            {featuredContent.map((content) => (
              <div key={content.id} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">{content.title}</h4>
                      {content.isPinned && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          <Pin className="h-3 w-3 mr-1" />
                          Pinned
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{content.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {content.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        £{content.prizePool}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {content.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {content.createdAt}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePinContent(content.id, content.isPinned)}
                    >
                      {content.isPinned ? (
                        <>
                          <Minus className="h-4 w-4 mr-1" />
                          Unpin
                        </>
                      ) : (
                        <>
                          <Pin className="h-4 w-4 mr-1" />
                          Pin
                        </>
                      )}
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Content</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="title">Title</Label>
                            <Input 
                              id="title" 
                              defaultValue={content.title}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea 
                              id="description" 
                              defaultValue={content.description}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => setEditingContent(null)}>
                              Save Changes
                            </Button>
                            <Button variant="outline" onClick={() => setEditingContent(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveContent(content.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Statistics */}
      <Card className="border-0 bg-gradient-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Content Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">342</div>
              <div className="text-sm text-muted-foreground">Total Posts</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Image className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">89</div>
              <div className="text-sm text-muted-foreground">Media Files</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Star className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">12</div>
              <div className="text-sm text-muted-foreground">Featured Posts</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};