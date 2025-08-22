import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import { Search, Filter, TrendingUp } from "lucide-react";
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
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const { posts, loading, error } = usePosts();
  const { categories } = useCategories();

  const categoryNames = useMemo(() => 
    ["All", ...categories.map(cat => cat.name)], 
    [categories]
  );

  const filteredPosts = useMemo(() => 
    posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || post.category.name === selectedCategory;
      return matchesSearch && matchesCategory;
    }), 
    [posts, searchQuery, selectedCategory]
  );

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
            <Button variant="outline" size="default">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categoryNames.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                className={`cursor-pointer transition-smooth ${
                  selectedCategory === category 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
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
              authorName={`${post.author.first_name} ${post.author.last_name}`}
              authorAvatar={post.author.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.first_name}`}
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