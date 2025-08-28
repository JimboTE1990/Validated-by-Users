import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Flag, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  MessageCircle,
  User,
  Calendar,
  Trash2,
  RotateCcw,
  Eye,
  ShieldAlert,
  Clock
} from "lucide-react";

interface FeedbackReport {
  id: string;
  comment_id: string;
  post_id: string;
  reporter_id: string;
  report_reason: string;
  report_details: string | null;
  created_at: string;
  comment: {
    id: string;
    content: string;
    user_id: string;
    created_at: string;
    report_status: string;
  };
  post: {
    id: string;
    title: string;
  };
}

export const AdminUserModeration = () => {
  const [reports, setReports] = useState<FeedbackReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<FeedbackReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionNotes, setActionNotes] = useState("");
  const { toast } = useToast();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('feedback_reports')
        .select(`
          *,
          comment:comments(id, content, user_id, created_at, report_status),
          post:posts(id, title)
        `)
        .eq('comment.report_status', 'reported_for_review')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
        toast({
          title: "Error",
          description: "Failed to load reports",
          variant: "destructive"
        });
        return;
      }

      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveContent = async (report: FeedbackReport) => {
    try {
      // Update comment status to active
      const { error } = await supabase
        .from('comments')
        .update({ 
          report_status: 'active',
          is_reported_by_author: false,
          reported_at: null,
          report_reason: null
        })
        .eq('id', report.comment_id);

      if (error) throw error;

      toast({
        title: "Content Approved",
        description: "The comment has been restored and is now visible."
      });

      // Refresh reports
      fetchReports();
    } catch (error) {
      console.error('Error approving content:', error);
      toast({
        title: "Error",
        description: "Failed to approve content",
        variant: "destructive"
      });
    }
  };

  const handleRemoveContent = async (report: FeedbackReport) => {
    try {
      // Update comment status to removed
      const { error } = await supabase
        .from('comments')
        .update({ 
          report_status: 'removed_by_admin',
          content: '[This comment was removed by moderators]'
        })
        .eq('id', report.comment_id);

      if (error) throw error;

      // Optionally add strike to user here using the increment_user_strike function
      const { error: strikeError } = await supabase.rpc('increment_user_strike', {
        target_user_id: report.comment.user_id
      });

      if (strikeError) {
        console.error('Error adding strike:', strikeError);
      }

      toast({
        title: "Content Removed",
        description: "The comment has been removed and a strike added to the user."
      });

      // Refresh reports
      fetchReports();
    } catch (error) {
      console.error('Error removing content:', error);
      toast({
        title: "Error",
        description: "Failed to remove content",
        variant: "destructive"
      });
    }
  };

  const handleOverrideStrikes = async (userId: string) => {
    try {
      // Reset user strikes and unsuspend
      const { error } = await supabase
        .from('user_strikes')
        .update({ 
          strike_count: 0,
          is_suspended: false,
          suspended_at: null
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Strikes Override",
        description: "User strikes have been reset and account restored."
      });
    } catch (error) {
      console.error('Error overriding strikes:', error);
      toast({
        title: "Error",
        description: "Failed to override strikes",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchReports();
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

  return (
    <div className="space-y-8">
      {/* Moderation Queue */}
      <Card className="border-0 bg-gradient-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-primary" />
              Moderation Queue
            </div>
            <Badge variant="secondary" className="bg-warning/10 text-warning">
              {reports.length} Pending
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse p-4 bg-muted/30 rounded-lg">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
              <p className="text-muted-foreground">No pending reports</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="p-4 bg-muted/30 rounded-lg border-l-4 border-warning">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="destructive" className="text-xs">
                          {report.report_reason}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          in "{report.post.title}"
                        </span>
                      </div>
                      
                      <div className="p-3 bg-background rounded border-l-2 border-muted mb-3">
                        <p className="text-sm text-foreground font-medium mb-1">Reported Comment:</p>
                        <p className="text-foreground">{report.comment.content}</p>
                      </div>

                      {report.report_details && (
                        <div className="p-3 bg-muted/50 rounded mb-3">
                          <p className="text-sm text-muted-foreground font-medium mb-1">Report Details:</p>
                          <p className="text-sm text-muted-foreground">{report.report_details}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(report.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          User ID: {report.comment.user_id.slice(0, 8)}...
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReport(report)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApproveContent(report)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveContent(report)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Strike Override Actions */}
      <Card className="border-0 bg-gradient-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            Strike Override & Emergency Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Override automated strike system when manual intervention is necessary.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto p-4 flex-col gap-2">
              <RotateCcw className="h-5 w-5 text-success" />
              <span>Reset User Strikes</span>
              <span className="text-xs text-muted-foreground">Clear all strikes for a user</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span>Manual Strike</span>
              <span className="text-xs text-muted-foreground">Add strike without content removal</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Reported Content</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Post Context</h4>
                <p className="text-sm text-muted-foreground">"{selectedReport.post.title}"</p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Reported Comment</h4>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-foreground">{selectedReport.comment.content}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Posted: {formatDate(selectedReport.comment.created_at)}</span>
                    <span>User: {selectedReport.comment.user_id.slice(0, 8)}...</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Report Reason</h4>
                <Badge variant="destructive">{selectedReport.report_reason}</Badge>
                {selectedReport.report_details && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">{selectedReport.report_details}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Admin Notes</h4>
                <Textarea
                  placeholder="Add notes about your decision..."
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedReport(null)}>
                  Cancel
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleApproveContent(selectedReport);
                    setSelectedReport(null);
                    setActionNotes("");
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve Content
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    handleRemoveContent(selectedReport);
                    setSelectedReport(null);
                    setActionNotes("");
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove Content
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};