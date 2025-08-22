import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, ArrowRight, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useCategories } from "@/hooks/useCategories";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CreatePost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { categories } = useCategories();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    productLink: "",
    prizePool: "",
    duration: "",
    categoryId: ""
  });
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!scheduleDate || !scheduleTime) {
      toast({
        title: "Missing Information",
        description: "Please select a schedule date and time.",
        variant: "destructive"
      });
      return;
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

      // Calculate end date based on duration
      const startDate = new Date(`${format(scheduleDate, 'yyyy-MM-dd')}T${scheduleTime}`);
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

      toast({
        title: "Post Created Successfully!",
        description: "Your validation round has been created and is now live."
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
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Label htmlFor="productLink">Link to App/Product</Label>
                  <Input
                    id="productLink"
                    type="url"
                    placeholder="https://yourproduct.com"
                    value={formData.productLink}
                    onChange={(e) => handleInputChange("productLink", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images">Upload Images</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setImages(e.target.files)}
                      className="hidden"
                    />
                    <Label htmlFor="images" className="cursor-pointer">
                      <span className="text-sm text-muted-foreground">
                        Click to upload images or drag and drop
                      </span>
                    </Label>
                    {images && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {images.length} file(s) selected
                      </p>
                    )}
                  </div>
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

                <div className="space-y-2">
                  <Label>Schedule Post Date/Time</Label>
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
                        required
                      />
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
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
                    type="submit" 
                    variant="hero" 
                    size="lg" 
                    className="min-w-[160px]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Post"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;