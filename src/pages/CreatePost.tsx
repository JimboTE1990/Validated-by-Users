import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, ArrowRight } from "lucide-react";
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
  const [images, setImages] = useState<FileList | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate total cost with 15% admin fee
    const prizeAmount = parseFloat(formData.prizePool) || 0;
    const adminFee = prizeAmount * 0.15;
    const totalCost = prizeAmount + adminFee;
    
    // Navigate to dummy checkout with the cost
    navigate('/checkout', { state: { totalCost, prizePool: prizeAmount, adminFee } });
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
                  <Label htmlFor="prizePool">Prize Pool Budget (£)</Label>
                  <Input
                    id="prizePool"
                    type="number"
                    min="10"
                    step="10"
                    placeholder="100"
                    value={formData.prizePool}
                    onChange={(e) => handleInputChange("prizePool", e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum £10. A 15% admin fee will be added at checkout.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Schedule Post Date/Time</Label>
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
                    Next: Payment
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