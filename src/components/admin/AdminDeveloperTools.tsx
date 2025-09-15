import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Code, 
  Bug, 
  Database, 
  ExternalLink,
  Play
} from "lucide-react";

export const AdminDeveloperTools = () => {
  const devTools = [
    {
      title: "E2E Test Flow",
      description: "Run complete end-to-end testing of the developer → user → payout flow",
      path: "/e2e-test",
      icon: Target,
      status: "Active",
      category: "Testing"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Code className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Developer Tools</h2>
          <p className="text-muted-foreground">
            Testing and debugging utilities for platform development
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Bug className="h-5 w-5 text-warning" />
            <div>
              <p className="text-sm font-medium text-warning">Admin Only</p>
              <p className="text-xs text-muted-foreground">
                These tools are restricted to administrators and should be used carefully in production
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Developer Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devTools.map((tool, index) => (
          <Card key={index} className="border-0 bg-gradient-card shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <tool.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {tool.category}
                      </Badge>
                      <Badge 
                        variant={tool.status === 'Active' ? 'default' : 'outline'} 
                        className="text-xs"
                      >
                        {tool.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4">
                {tool.description}
              </p>
              <Button asChild className="w-full">
                <Link to={tool.path} className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Launch Tool
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Tools Section */}
      <Card className="border-0 bg-gradient-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Additional Development Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Database Tools</h4>
              <p className="text-sm text-muted-foreground">
                Access Supabase dashboard and database management tools
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">API Testing</h4>
              <p className="text-sm text-muted-foreground">
                Test edge functions and API endpoints in development
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};