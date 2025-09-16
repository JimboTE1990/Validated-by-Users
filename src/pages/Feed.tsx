import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import { Search, Filter, TrendingUp, X } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";

const getTimeLeft = (endDate: string) => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return "Ended";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} left`;
  } else {
    return `${hours} hour${hours > 1 ? 's' : ''} left`;
  }
};

const Feed = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAmountRanges, setSelectedAmountRanges] = useState<string[]>([]);
  const [selectedTimeRanges, setSelectedTimeRanges] = useState<string[]>([]);
  
  const { posts, loading, error, enterDraw } = usePosts();
  const { categories } = useCategories();

  const categoryNames = useMemo(() => 
    categories.map(cat => cat.name), 
    [categories]
  );

  const amountRanges = useMemo(() => [
    { label: "Under £50", min: 0, max: 49 },
    { label: "£50 - £100", min: 50, max: 100 },
    { label: "£100 - £500", min: 100, max: 500 },
    { label: "£500 - £1000", min: 500, max: 1000 },
    { label: "Over £1000", min: 1000, max: Infinity }
  ], []);

  const timeRanges = useMemo(() => [
    { label: "Ending soon (< 24h)", hours: 24 },
    { label: "This week (< 7 days)", hours: 168 },
    { label: "This month (< 30 days)", hours: 720 },
    { label: "Long term (> 30 days)", hours: Infinity }
  ], []);

  const getTimeLeftInHours = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    return Math.max(0, diff / (1000 * 60 * 60));
  };

  const filteredPosts = useMemo(() => 
    posts.filter(post => {
      // Search filter
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategories.length === 0 || 
                             selectedCategories.includes(post.category.name);
      
      // Amount filter
      const matchesAmount = selectedAmountRanges.length === 0 ||
                           selectedAmountRanges.some(range => {
                             const rangeObj = amountRanges.find(r => r.label === range);
                             if (!rangeObj) return false;
                             return post.prize_pool >= rangeObj.min && 
                                    (rangeObj.max === Infinity || post.prize_pool <= rangeObj.max);
                           });
      
      // Time filter
      const hoursLeft = getTimeLeftInHours(post.end_date);
      const matchesTime = selectedTimeRanges.length === 0 ||
                         selectedTimeRanges.some(range => {
                           const rangeObj = timeRanges.find(r => r.label === range);
                           if (!rangeObj) return false;
                           if (rangeObj.hours === Infinity) return hoursLeft > 720;
                           return hoursLeft <= rangeObj.hours;
                         });
      
      return matchesSearch && matchesCategory && matchesAmount && matchesTime;
    }), 
    [posts, searchQuery, selectedCategories, selectedAmountRanges, selectedTimeRanges, amountRanges, timeRanges]
  );

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedAmountRanges([]);
    setSelectedTimeRanges([]);
    setSearchQuery("");
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
                          selectedAmountRanges.length > 0 || 
                          selectedTimeRanges.length > 0 || 
                          searchQuery.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="text-center">
            <div className="text-lg text-muted-foreground">Loading posts...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="text-center">
            <div className="text-lg text-destructive">Error loading posts: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        {/* Test Disclaimer Banner */}
        <div className="mb-8 p-4 bg-warning/10 border border-warning/20 rounded-lg text-center">
          <p className="text-warning font-medium text-sm">
            ⚠️ <strong>TEST MODE:</strong> These are sample requests for testing purposes only. No real prizes available and no actual products are being validated.
          </p>
        </div>
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Discover Amazing Products
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse live validation rounds, leave feedback, and win prizes while helping founders build better products.
          </p>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="default" className="relative">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-background border border-border">
                <div className="flex items-center justify-between p-2">
                  <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                  {hasActiveFilters && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearAllFilters}
                      className="h-6 px-2 text-xs"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
                
                <DropdownMenuSeparator />
                
                <div className="p-2">
                  <DropdownMenuLabel className="text-xs text-muted-foreground mb-2">Categories</DropdownMenuLabel>
                  {categoryNames.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, category]);
                        } else {
                          setSelectedCategories(selectedCategories.filter(c => c !== category));
                        }
                      }}
                      className="text-sm"
                    >
                      {category}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
                
                <DropdownMenuSeparator />
                
                <div className="p-2">
                  <DropdownMenuLabel className="text-xs text-muted-foreground mb-2">Prize Amount</DropdownMenuLabel>
                  {amountRanges.map((range) => (
                    <DropdownMenuCheckboxItem
                      key={range.label}
                      checked={selectedAmountRanges.includes(range.label)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedAmountRanges([...selectedAmountRanges, range.label]);
                        } else {
                          setSelectedAmountRanges(selectedAmountRanges.filter(a => a !== range.label));
                        }
                      }}
                      className="text-sm"
                    >
                      {range.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
                
                <DropdownMenuSeparator />
                
                <div className="p-2">
                  <DropdownMenuLabel className="text-xs text-muted-foreground mb-2">Time Remaining</DropdownMenuLabel>
                  {timeRanges.map((range) => (
                    <DropdownMenuCheckboxItem
                      key={range.label}
                      checked={selectedTimeRanges.includes(range.label)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTimeRanges([...selectedTimeRanges, range.label]);
                        } else {
                          setSelectedTimeRanges(selectedTimeRanges.filter(t => t !== range.label));
                        }
                      }}
                      className="text-sm"
                    >
                      {range.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {selectedCategories.map((category) => (
                <Badge key={category} variant="secondary" className="bg-primary/10 text-primary">
                  {category}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== category))}
                  />
                </Badge>
              ))}
              {selectedAmountRanges.map((range) => (
                <Badge key={range} variant="secondary" className="bg-success/10 text-success">
                  {range}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => setSelectedAmountRanges(selectedAmountRanges.filter(a => a !== range))}
                  />
                </Badge>
              ))}
              {selectedTimeRanges.map((range) => (
                <Badge key={range} variant="secondary" className="bg-accent/10 text-accent">
                  {range}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => setSelectedTimeRanges(selectedTimeRanges.filter(t => t !== range))}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        {/* Stats Bar */}
        <div className="flex items-center justify-center gap-8 mb-12 p-6 bg-gradient-card rounded-lg border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{filteredPosts.length}</div>
            <div className="text-sm text-muted-foreground">Active Rounds</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              £{filteredPosts.reduce((sum, post) => sum + post.prize_pool, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Prizes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {filteredPosts.reduce((sum, post) => sum + post.current_entries, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Entries</div>
          </div>
        </div>
        
        {/* Posts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <PostCard 
              key={post.id} 
              id={post.id}
              title={post.title}
              description={post.description}
              prizePool={post.prize_pool}
              timeLeft={getTimeLeft(post.end_date)}
              commentCount={post.current_entries}
              category={post.category.name}
               authorName={`${post.author?.first_name || 'Anonymous'} ${post.author?.last_name || 'User'}`}
               authorAvatar={post.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.first_name || 'anonymous'}`}
              authorId={post.author_id}
              userEntry={post.user_entry}
              onEnterDraw={enterDraw}
            />
          ))}
        </div>
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No posts found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
          </div>
        )}
        
        {/* Load More */}
        {filteredPosts.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Posts
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;