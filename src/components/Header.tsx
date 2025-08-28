import { Button } from "@/components/ui/button";
import { Trophy, Users, Zap, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRole } from "@/hooks/useAdminRole";

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminRole();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "An error occurred while signing out.",
        variant: "destructive",
      });
    }
  };

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const handleSignIn = () => {
    navigate("/auth");
  };

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
          {user ? (
            <Link to="/profile" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
              Profile
            </Link>
          ) : (
            <button onClick={handleSignIn} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
              Profile
            </button>
          )}
          
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                {isAdmin && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin" className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={handleSignIn}>
                  Sign In
                </Button>
                <Button variant="hero" size="sm" onClick={handleGetStarted}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;