
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, ArrowRight, Clock, X, ChevronLeft, Trophy, Zap, Shield } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useCategories } from "@/hooks/useCategories";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useImageUpload } from "@/hooks/useImageUpload";

const CreatePost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { categories } = useCategories();
  const { uploadImages, uploading } = useImageUpload();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    productLink: "",
    prizePool: "",
    duration: "",
    categoryId: ""
  });
  const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter(file => {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
        
        if (!isValidSize) {
          toast({
            title: "File Too Large",
            description: `${file.name} is larger than 10MB`,
            variant: "destructive"
          });
          return false;
        }
        
        return isImage || isVideo;
      });
      
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate Step 1 fields
      if (!formData.title || !formData.description || !formData.categoryId || 
          !formData.prizePool || !formData.duration) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields before proceeding.",
          variant: "destructive"
        });
        return;
      }
      
      if (scheduleType === "later" && (!scheduleDate || !scheduleTime)) {
        toast({
          title: "Missing Information",
          description: "Please select a schedule date and time for scheduled posts.",
          variant: "destructive"
        });
        return;
      }

      // Check if URL is missing and ask for confirmation
      if (!formData.productLink.trim()) {
        const shouldContinue = window.confirm(
          "You haven't entered a website/URL. Are you sure you'd like to continue without one?"
        );
        if (!shouldContinue) {
          return;
        }
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = async () => {
    
    if (scheduleType === "later" && (!scheduleDate || !scheduleTime)) {
      toast({
        title: "Missing Information",
        description: "Please select a schedule date and time for scheduled posts.",
        variant: "destructive"
      });
      return;
    }

    // Check if URL is missing and ask for confirmation
    if (!formData.productLink.trim()) {
      const shouldContinue = window.confirm(
        "You haven't entered a website/URL. Are you sure you'd like to continue without one?"
      );
      if (!shouldContinue) {
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to create a post.",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      // Calculate start and end dates
      let startDate: Date;
      if (scheduleType === "now") {
        startDate = new Date();
      } else {
        startDate = new Date(`${format(scheduleDate!, 'yyyy-MM-dd')}T${scheduleTime}`);
      }
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + parseInt(formData.duration));

      // Create post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          title: formData.title,
          description: formData.description,
          product_link: formData.productLink || null,
          prize_pool: parseFloat(formData.prizePool),
          category_id: formData.categoryId,
          author_id: user.id,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          status: 'active'
        })
        .select()
        .single();

      if (postError) throw postError;

      // Upload images if any
      if (selectedFiles.length > 0) {
        const fileList = new DataTransfer();
        selectedFiles.forEach(file => fileList.items.add(file));
        await uploadImages(fileList.files, post.id);
      }

      toast({
        title: "Post Created Successfully!",
        description: scheduleType === "now" 
          ? "Your validation round is now live." 
          : "Your validation round has been scheduled."
      });

      navigate(`/post/${post.id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Failed to Create Post",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">1</span>
          Post Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Product/Startup Title</Label>
            <Input
              id="title"
              placeholder="Enter your product or startup name..."
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description of Startup/Product</Label>
            <Textarea
              id="description"
              placeholder="Describe your startup or product in detail..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select 
              value={formData.categoryId} 
              onValueChange={(value) => handleInputChange("categoryId", value)} 
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productLink">Website/URL</Label>
            <Input
              id="productLink"
              type="text"
              placeholder="https://yourproduct.com"
              value={formData.productLink}
              onChange={(e) => handleInputChange("productLink", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Optional - Add your website or product URL
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="media">Upload Images/Videos</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <Input
                id="media"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelection}
                className="hidden"
              />
              <Label htmlFor="media" className="cursor-pointer">
                <span className="text-sm text-muted-foreground">
                  Click to upload images/videos or drag and drop
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  Max file size: 10MB. Supported: JPG, PNG, GIF, MP4, MOV
                </p>
              </Label>
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <Label>Selected Files:</Label>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span className="text-sm truncate flex-1">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Prize Pool Budget (£)</Label>
            <Select value={formData.prizePool} onValueChange={(value) => handleInputChange("prizePool", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select prize pool amount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">£10</SelectItem>
                <SelectItem value="25">£25</SelectItem>
                <SelectItem value="50">£50</SelectItem>
                <SelectItem value="100">£100</SelectItem>
                <SelectItem value="250">£250</SelectItem>
                <SelectItem value="500">£500</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              A 15% admin fee will be added at checkout.
            </p>
          </div>

          <div className="space-y-4">
            <Label>Post Timing</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={scheduleType === "now" ? "default" : "outline"}
                onClick={() => setScheduleType("now")}
                className="flex-1"
              >
                Post Now
              </Button>
              <Button
                type="button"
                variant={scheduleType === "later" ? "default" : "outline"}
                onClick={() => setScheduleType("later")}
                className="flex-1"
              >
                Schedule Later
              </Button>
            </div>

            {scheduleType === "later" && (
              <div className="space-y-2">
                <Label>Schedule Date/Time</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !scheduleDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={scheduleDate}
                        onSelect={setScheduleDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="relative">
                    <Input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="pl-10"
                      required={scheduleType === "later"}
                    />
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Duration of Post</Label>
            <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="button"
              onClick={nextStep}
              variant="hero" 
              size="lg" 
              className="min-w-[160px]"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => {
    const prizeAmount = parseFloat(formData.prizePool);
    const adminFee = prizeAmount * 0.15;
    const totalCost = prizeAmount + adminFee;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">2</span>
            Prize Pool & Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Prize Pool Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Prize Pool Breakdown
              </h3>
              <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Prize Pool Amount:</span>
                  <span className="font-medium">£{prizeAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Platform Fee (15%):</span>
                  <span className="font-medium">£{adminFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total Cost:</span>
                    <span>£{totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Boosting Feature */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Boost Your Best Feedback
              </h3>
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 space-y-3">
                <p className="text-sm text-muted-foreground">
                  As the post author, you'll have the exclusive ability to boost up to 5 exceptional comments.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Boost comments that provide the most value
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Each boost gives +3 additional entries to that commenter
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Reward quality feedback and encourage detailed responses
                  </li>
                </ul>
              </div>
            </div>

            {/* Guarantees */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Our Guarantees
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm">Quality Feedback</h4>
                  <p className="text-xs text-muted-foreground">
                    We moderate all feedback to ensure constructive, valuable responses.
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm">Fair Prize Distribution</h4>
                  <p className="text-xs text-muted-foreground">
                    Winners are selected randomly from quality feedback contributors.
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm">Secure Payments</h4>
                  <p className="text-xs text-muted-foreground">
                    All payments processed securely through Stripe.
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm">Money-Back Guarantee</h4>
                  <p className="text-xs text-muted-foreground">
                    Full refund if you don't receive quality feedback.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button 
                type="button"
                onClick={prevStep}
                variant="outline" 
                size="lg" 
                className="min-w-[120px]"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                type="button"
                onClick={nextStep}
                variant="hero" 
                size="lg" 
                className="min-w-[160px]"
              >
                Continue to Payment
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderStep3 = () => {
    const prizeAmount = parseFloat(formData.prizePool);
    const adminFee = prizeAmount * 0.15;
    const totalCost = prizeAmount + adminFee;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">3</span>
            Payment & Launch
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Order Summary</h3>
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Post Title:</span>
                  <span className="font-medium text-right max-w-[200px] truncate">{formData.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span className="font-medium">{formData.duration} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Prize Pool:</span>
                  <span className="font-medium">£{prizeAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Platform Fee:</span>
                  <span className="font-medium">£{adminFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>£{totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Options (Dummy for now) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Payment Method</h3>
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 text-center">
                <p className="text-muted-foreground mb-4">Payment integration coming soon!</p>
                <p className="text-sm text-muted-foreground">
                  For now, clicking "Launch Post" will create your post immediately.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button 
                type="button"
                onClick={prevStep}
                variant="outline" 
                size="lg" 
                className="min-w-[120px]"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                type="button"
                onClick={handleFinalSubmit}
                variant="hero" 
                size="lg" 
                className="min-w-[160px]"
                disabled={isSubmitting || uploading}
              >
                {isSubmitting ? "Creating..." : uploading ? "Uploading..." : "Launch Post"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Request User Feedback
            </h1>
            <p className="text-muted-foreground">
              Create a prize pool to get valuable feedback from our community
            </p>
            
            {/* Progress Indicator */}
            <div className="flex items-center gap-4 mt-6">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                    step === currentStep 
                      ? "bg-primary text-primary-foreground" 
                      : step < currentStep 
                        ? "bg-primary/20 text-primary" 
                        : "bg-muted text-muted-foreground"
                  )}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={cn(
                      "w-12 h-0.5 mx-2 transition-colors",
                      step < currentStep ? "bg-primary" : "bg-muted"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
