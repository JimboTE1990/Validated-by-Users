import { Button } from "@/components/ui/button";
import { Trophy, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">Validated by Users</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/feed" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
            Discover
          </Link>
          <Link to="/profile" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
            Profile
          </Link>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button variant="hero" size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;