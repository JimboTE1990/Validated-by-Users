import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import { Search, Filter, TrendingUp } from "lucide-react";

// Mock data for posts
const mockPosts = [
  {
    id: "1",
    title: "EcoTrack - Personal Carbon Footprint App",
    description: "A sleek mobile app that helps users track their daily carbon footprint through smart integrations with transport, energy, and shopping habits.",
    prizePool: 250,
    timeLeft: "2 days left",
    commentCount: 47,
    category: "Environment",
    authorName: "Sarah Chen",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
  },
  {
    id: "2", 
    title: "DevSync - Real-time Code Collaboration",
    description: "Revolutionary platform enabling developers to collaborate on code in real-time with AI-powered conflict resolution and seamless version control.",
    prizePool: 500,
    timeLeft: "5 hours left",
    commentCount: 123,
    category: "Developer Tools",
    authorName: "Alex Rodriguez",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
  },
  {
    id: "3",
    title: "MindfulAI - Mental Health Companion",
    description: "AI-powered mental health companion that provides personalized meditation, mood tracking, and therapeutic exercises based on cognitive behavioral therapy.",
    prizePool: 100,
    timeLeft: "1 day left", 
    commentCount: 89,
    category: "Health & Wellness",
    authorName: "Dr. Emily Watson",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily"
  },
  {
    id: "4",
    title: "LocalConnect - Neighborhood Community Hub",
    description: "Hyperlocal social platform connecting neighbors for skill sharing, local events, borrowing items, and building stronger communities.",
    prizePool: 75,
    timeLeft: "3 days left",
    commentCount: 34,
    category: "Social",
    authorName: "Marcus Johnson",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus"
  },
  {
    id: "5",
    title: "InvestWise - Beginner-Friendly Trading",
    description: "Simplified investment platform with educational content, risk assessment, and automated portfolio balancing for first-time investors.",
    prizePool: 1000,
    timeLeft: "6 hours left",
    commentCount: 267,
    category: "Finance",
    authorName: "Jennifer Kim",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer"
  },
  {
    id: "6",
    title: "FoodRescue - Reduce Restaurant Waste",
    description: "App connecting restaurants with surplus food to local charities and consumers at discounted prices, reducing waste while helping communities.",
    prizePool: 150,
    timeLeft: "4 days left",
    commentCount: 56,
    category: "Social Impact",
    authorName: "David Park",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david"
  }
];

const categories = ["All", "Tech", "Health & Wellness", "Finance", "Environment", "Social", "Developer Tools", "Social Impact"];

const Feed = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            {categories.map((category) => (
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
              £{filteredPosts.reduce((sum, post) => sum + post.prizePool, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Prizes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {filteredPosts.reduce((sum, post) => sum + post.commentCount, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Entries</div>
          </div>
        </div>
        
        {/* Posts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} {...post} />
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