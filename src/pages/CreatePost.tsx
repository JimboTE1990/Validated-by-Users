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

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
    productLink: "",
    prizePool: "",
    duration: ""
  });
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState("");
  const [images, setImages] = useState<FileList | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Navigate to terms and conditions page
    navigate('/terms-conditions', { 
      state: { 
        formData, 
        scheduleDate, 
        scheduleTime,
        prizePool: parseFloat(formData.prizePool) || 0
      } 
    });
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
                  <Button type="submit" variant="hero" size="lg" className="min-w-[160px]">
                    Next: Terms & Conditions
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