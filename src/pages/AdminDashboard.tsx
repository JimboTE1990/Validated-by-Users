import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useAdminSecurity } from "@/hooks/useAdminSecurity";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Users, 
  Flag, 
  FileText, 
  Settings, 
  Activity,
  AlertTriangle,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  Upload,
  Pin,
  Minus
} from "lucide-react";
import { Link } from "react-router-dom";
import { AdminContentManager } from "@/components/admin/AdminContentManager";
import { AdminUserModeration } from "@/components/admin/AdminUserModeration";
import { AdminAccountManager } from "@/components/admin/AdminAccountManager";
import { AdminOversight } from "@/components/admin/AdminOversight";
import { AdminSecurityPanel } from "@/components/admin/AdminSecurityPanel";
import ProtectedRoute from "@/components/ProtectedRoute";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isAdmin, loading } = useAdminRole();
  const { logActivity, updateActivity, checkSessionTimeout } = useAdminSecurity({
    enableSessionTracking: true,
    sessionTimeout: 120 // 2 hours
  });
  const [activeTab, setActiveTab] = useState("overview");

  // Log dashboard access on mount
  useEffect(() => {
    if (isAdmin && user) {
      logActivity('admin_dashboard_access', 'dashboard', undefined, {
        page: 'admin_dashboard',
        user_email: user.email
      });
    }
  }, [isAdmin, user, logActivity]);

  // Check session timeout periodically
  useEffect(() => {
    if (isAdmin) {
      const interval = setInterval(() => {
        if (checkSessionTimeout()) {
          // Redirect to login or show session expired modal
          window.location.href = '/auth';
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [isAdmin, checkSessionTimeout]);

  // Track user activity on tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    updateActivity();
    logActivity('admin_tab_navigation', 'dashboard', undefined, {
      from_tab: activeTab,
      to_tab: tab
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-lg text-muted-foreground">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16">
          <div className="text-center max-w-md mx-auto">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You need admin privileges to access this dashboard.
            </p>
            <Button asChild>
              <Link to="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const adminStats = [
    {
      title: "Active Users",
      value: "1,247",
      icon: Users,
      trend: "+12.3%",
      color: "text-primary"
    },
    {
      title: "Flagged Posts",
      value: "23",
      icon: Flag,
      trend: "Needs Review",
      color: "text-warning"
    },
    {
      title: "User Reports",
      value: "8",
      icon: AlertTriangle,
      trend: "Pending",
      color: "text-destructive"
    },
    {
      title: "Strike Actions",
      value: "5",
      icon: Ban,
      trend: "Last 24h",
      color: "text-muted-foreground"
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container py-8">
          {/* Admin Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                  Manage content, moderate users, and oversee platform operations
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Administrator • {user?.email}
            </Badge>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-6 max-w-3xl mb-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="moderation" className="flex items-center gap-2">
                <Flag className="h-4 w-4" />
                Moderate
              </TabsTrigger>
              <TabsTrigger value="accounts" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Accounts
              </TabsTrigger>
              <TabsTrigger value="oversight" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Oversight
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {adminStats.map((stat, index) => (
                  <Card key={index} className="border-0 bg-gradient-card shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                          <p className={`text-xs ${stat.color}`}>{stat.trend}</p>
                        </div>
                        <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <stat.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Button
                  variant="outline"
                  className="h-auto p-6 flex-col gap-2"
                  onClick={() => handleTabChange("content")}
                >
                  <Upload className="h-6 w-6 text-primary" />
                  <span>Manage Content</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-6 flex-col gap-2"
                  onClick={() => handleTabChange("moderation")}
                >
                  <Flag className="h-6 w-6 text-warning" />
                  <span>Review Reports</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-6 flex-col gap-2"
                  onClick={() => handleTabChange("accounts")}
                >
                  <UserCheck className="h-6 w-6 text-success" />
                  <span>Manage Users</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-6 flex-col gap-2"
                  onClick={() => handleTabChange("oversight")}
                >
                  <Activity className="h-6 w-6 text-accent" />
                  <span>View Logs</span>
                </Button>
              </div>

              {/* Recent Activity */}
              <Card className="border-0 bg-gradient-card shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Recent Admin Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <div>
                        <p className="font-medium text-foreground">Content approved</p>
                        <p className="text-sm text-muted-foreground">Step 2 media updated</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">2 min ago</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Ban className="h-5 w-5 text-destructive" />
                      <div>
                        <p className="font-medium text-foreground">User suspended</p>
                        <p className="text-sm text-muted-foreground">3 strikes reached</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">15 min ago</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Flag className="h-5 w-5 text-warning" />
                      <div>
                        <p className="font-medium text-foreground">Report reviewed</p>
                        <p className="text-sm text-muted-foreground">Spam comment removed</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">1 hr ago</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <AdminContentManager />
            </TabsContent>

            <TabsContent value="moderation">
              <AdminUserModeration />
            </TabsContent>

            <TabsContent value="accounts">
              <AdminAccountManager />
            </TabsContent>

            <TabsContent value="security">
              <AdminSecurityPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;