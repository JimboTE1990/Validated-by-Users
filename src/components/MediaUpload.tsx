import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Play, Image, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useHomeMedia } from "@/hooks/useHomeMedia";

interface MediaUploadProps {
  stepNumber: number;
  stepTitle: string;
}

export const MediaUpload = ({ stepNumber, stepTitle }: MediaUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminRole();
  const { uploadMedia, removeMedia, getMediaForStep, loading: mediaLoading } = useHomeMedia();

  const currentMedia = getMediaForStep(stepNumber);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload media.",
        variant: "destructive"
      });
      return;
    }

    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can upload home screen media.",
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image or video file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 50MB.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    await uploadMedia(stepNumber, file);
    setUploading(false);
  };

  const handleRemoveMedia = async () => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can remove home screen media.",
        variant: "destructive"
      });
      return;
    }

    await removeMedia(stepNumber);
  };

  const triggerFileSelect = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload media.",
        variant: "destructive"
      });
      return;
    }

    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can upload home screen media.",
        variant: "destructive"
      });
      return;
    }

    fileInputRef.current?.click();
  };

  if (adminLoading || mediaLoading) {
    return (
      <Card className="border-2 border-dashed border-border/50">
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">
            <div className="text-sm">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show admin-only indicator for non-admin users
  if (!isAdmin) {
    return (
      <Card className="border-2 border-dashed border-border/50 bg-muted/20">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-semibold text-muted-foreground mb-2">
                Admin Only
              </h4>
              <p className="text-sm text-muted-foreground">
                Media upload for {stepTitle} is restricted to administrators only.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentMedia) {
    return (
      <div className="relative group">
        {currentMedia.media_type === 'video' ? (
          <video 
            src={currentMedia.file_path}
            controls
            className="w-full h-auto rounded-lg shadow-2xl border border-border/50"
            style={{ maxHeight: '400px' }}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img 
            src={currentMedia.file_path}
            alt={`${stepTitle} preview`}
            className="w-full h-auto rounded-lg shadow-2xl border border-border/50"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
        )}
        
        {/* Overlay controls */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={triggerFileSelect}
              disabled={uploading}
              className="bg-background/90 backdrop-blur-sm"
            >
              <Upload className="h-4 w-4 mr-1" />
              Replace
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleRemoveMedia}
              className="bg-background/90 backdrop-blur-sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <Card className="border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
      <CardContent className="p-8">
        <div 
          className="text-center space-y-4"
          onClick={triggerFileSelect}
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-2">
              Add Media for {stepTitle}
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Upload an image or video to showcase this step of the journey
            </p>
            
            <Button 
              variant="outline" 
              disabled={uploading}
              className="min-w-[120px]"
            >
              {uploading ? (
                "Uploading..."
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </>
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Image className="h-3 w-3" />
              Images
            </div>
            <div className="flex items-center gap-1">
              <Play className="h-3 w-3" />
              Videos
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Max file size: 50MB • Admin access required
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};