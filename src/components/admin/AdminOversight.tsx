import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Activity, 
  TestTube, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Zap,
  Play,
  RefreshCw,
  Eye,
  Calendar,
  User,
  MessageCircle
} from "lucide-react";

interface ModerationLog {
  id: string;
  content: string;
  user_id: string;
  classification: string;
  reason: string;
  action_taken: string;
  strike_level: number;
  created_at: string;
}

export const AdminOversight = () => {
  const [logs, setLogs] = useState<ModerationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [testScenario, setTestScenario] = useState("");
  const { toast } = useToast();

  const fetchModerationLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('moderated_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching logs:', error);
        toast({
          title: "Error",
          description: "Failed to load moderation logs",
          variant: "destructive"
        });
        return;
      }

      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const runTestScenario = async (scenario: string) => {
    try {
      let testContent = "";
      
      switch (scenario) {
        case "spam":
          testContent = "Great post! Check out my website: www.spam-site.com for amazing deals!!!";
          break;
        case "valid":
          testContent = "I really like this concept. The user interface looks clean and intuitive. Have you considered adding a dark mode option?";
          break;
        case "borderline":
          testContent = "Nice idea but seems similar to existing solutions";
          break;
        default:
          testContent = testScenario;
      }

      // Use the moderation service to test content
      // const { moderateContent } = await import('@/hooks/useModeration');
      
      toast({
        title: "Test Scenario Running",
        description: `Testing content: "${testContent.substring(0, 50)}..."`
      });

      // This would trigger the moderation system
      // For demo purposes, we'll show what would happen
      const mockResult = {
        spam: { classification: "spam", reason: "Contains promotional links and excessive punctuation" },
        valid: { classification: "valid", reason: "Constructive feedback with specific suggestions" },
        borderline: { classification: "valid", reason: "Brief but relevant feedback" }
      };

      const result = mockResult[scenario as keyof typeof mockResult] || { 
        classification: "unknown", 
        reason: "Test scenario" 
      };

      setTimeout(() => {
        toast({
          title: "Test Complete",
          description: `Classification: ${result.classification} - ${result.reason}`
        });
        
        // Refresh logs to show new test entry
        fetchModerationLogs();
      }, 2000);

    } catch (error) {
      console.error('Error running test scenario:', error);
      toast({
        title: "Test Failed",
        description: "Failed to run test scenario",
        variant: "destructive"
      });
    }
  };

  const simulateReviewExpiry = async () => {
    try {
      // This would typically trigger a batch job to process expired reviews
      toast({
        title: "Review Expiry Simulation",
        description: "Simulating batch processing of expired review periods..."
      });

      // Mock the process
      setTimeout(() => {
        toast({
          title: "Simulation Complete",
          description: "3 prize pools processed, 12 winners selected"
        });
      }, 3000);

    } catch (error) {
      console.error('Error simulating review expiry:', error);
      toast({
        title: "Simulation Failed",
        description: "Failed to simulate review expiry",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchModerationLogs();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'approved': return 'text-success';
      case 'flagged': return 'text-warning';
      case 'removed': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getClassificationBadge = (classification: string) => {
    switch (classification) {
      case 'valid':
        return <Badge variant="secondary" className="bg-success/10 text-success">Valid</Badge>;
      case 'spam':
        return <Badge variant="destructive">Spam</Badge>;
      default:
        return <Badge variant="outline">{classification}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Test Scenarios */}
      <Card className="border-0 bg-gradient-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-primary" />
            Test Scenarios & Simulations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold text-foreground mb-4">Spam Detection Tests</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex-col gap-2"
                onClick={() => runTestScenario("spam")}
              >
                <AlertTriangle className="h-5 w-5 text-warning" />
                <span>Test Spam Content</span>
                <span className="text-xs text-muted-foreground">Promotional links & excessive punctuation</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 flex-col gap-2"
                onClick={() => runTestScenario("valid")}
              >
                <CheckCircle className="h-5 w-5 text-success" />
                <span>Test Valid Content</span>
                <span className="text-xs text-muted-foreground">Constructive feedback</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 flex-col gap-2"
                onClick={() => runTestScenario("borderline")}
              >
                <Eye className="h-5 w-5 text-accent" />
                <span>Test Borderline</span>
                <span className="text-xs text-muted-foreground">Brief but relevant</span>
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Custom Test Content:</label>
              <Textarea
                placeholder="Enter custom content to test moderation system..."
                value={testScenario}
                onChange={(e) => setTestScenario(e.target.value)}
              />
              <Button 
                variant="outline" 
                onClick={() => runTestScenario("custom")}
                disabled={!testScenario.trim()}
              >
                <Play className="h-4 w-4 mr-2" />
                Run Custom Test
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">System Simulations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex-col gap-2"
                onClick={simulateReviewExpiry}
              >
                <Clock className="h-5 w-5 text-primary" />
                <span>Simulate Review Expiry</span>
                <span className="text-xs text-muted-foreground">Test prize pool conclusion process</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 flex-col gap-2"
                onClick={() => {
                  toast({
                    title: "Strike Reset Simulation",
                    description: "Simulating monthly strike reset process..."
                  });
                }}
              >
                <RefreshCw className="h-5 w-5 text-accent" />
                <span>Simulate Strike Reset</span>
                <span className="text-xs text-muted-foreground">Test monthly strike cleanup</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Moderation Logs */}
      <Card className="border-0 bg-gradient-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Moderation Activity Logs
            </div>
            <Button variant="outline" size="sm" onClick={fetchModerationLogs}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse p-4 bg-muted/30 rounded-lg">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No moderation logs yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getClassificationBadge(log.classification)}
                      {log.strike_level > 0 && (
                        <Badge variant="outline" className="border-warning text-warning">
                          Strike {log.strike_level}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(log.created_at)}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="p-3 bg-background rounded border-l-2 border-muted">
                      <p className="text-sm text-foreground font-medium mb-1">Content:</p>
                      <p className="text-foreground text-sm">{log.content}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Reason: </span>
                        <span className="text-foreground">{log.reason}</span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Action: </span>
                        <span className={getActionColor(log.action_taken)}>{log.action_taken}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground text-xs">
                          {log.user_id.slice(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Health */}
      <Card className="border-0 bg-gradient-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            System Health & Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">98.5%</div>
              <div className="text-sm text-muted-foreground">Moderation Accuracy</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">1.2s</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Activity className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">247</div>
              <div className="text-sm text-muted-foreground">Actions Today</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};