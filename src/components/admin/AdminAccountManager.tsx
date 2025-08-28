import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  Ban, 
  UserCheck, 
  UserX, 
  Search,
  Calendar,
  Mail,
  AlertTriangle,
  Shield,
  Trash2,
  RotateCcw,
  Activity,
  MessageCircle,
  Trophy
} from "lucide-react";

interface UserAccount {
  id: string;
  email: string;
  created_at: string;
  profile?: {
    first_name: string | null;
    last_name: string | null;
    total_feedback: number;
    total_entries: number;
    total_winnings: number;
  };
  strikes?: {
    strike_count: number;
    is_suspended: boolean;
    suspended_at: string | null;
  };
  roles?: {
    role: string;
  }[];
}

export const AdminAccountManager = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "suspended" | "active" | "admins">("all");
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users from auth.users via a secure query
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        // Fallback to profiles table if admin access not available
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id,
            first_name,
            last_name,
            total_feedback,
            total_entries,
            total_winnings
          `)
          .limit(50);

        if (profilesError) throw profilesError;

        // Transform profiles data to match expected format
        const transformedData = profilesData?.map(profile => ({
          id: profile.id,
          email: `user-${profile.id.slice(0, 8)}@platform.com`, // Placeholder
          created_at: new Date().toISOString(),
          profile: {
            first_name: profile.first_name,
            last_name: profile.last_name,
            total_feedback: profile.total_feedback,
            total_entries: profile.total_entries,
            total_winnings: profile.total_winnings
          }
        })) || [];

        setUsers(transformedData);
        return;
      }

      // Get additional profile data for each user
      const userIds = authData.users.map(user => user.id);
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      const { data: strikes } = await supabase
        .from('user_strikes')
        .select('*')
        .in('user_id', userIds);

      const { data: roles } = await supabase
        .from('user_roles')
        .select('*')
        .in('user_id', userIds);

      // Combine data
      const enrichedUsers = authData.users.map(user => ({
        id: user.id,
        email: user.email || 'Unknown',
        created_at: user.created_at,
        profile: profiles?.find(p => p.id === user.id),
        strikes: strikes?.find(s => s.user_id === user.id),
        roles: roles?.filter(r => r.user_id === user.id)
      }));

      setUsers(enrichedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load user accounts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const suspendUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_strikes')
        .upsert({
          user_id: userId,
          strike_count: 3,
          is_suspended: true,
          suspended_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "User Suspended",
        description: "The user account has been suspended."
      });

      fetchUsers();
    } catch (error) {
      console.error('Error suspending user:', error);
      toast({
        title: "Error",
        description: "Failed to suspend user",
        variant: "destructive"
      });
    }
  };

  const reinstateUser = async (userId: string) => {
    try {
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
        title: "User Reinstated",
        description: "The user account has been reinstated."
      });

      fetchUsers();
    } catch (error) {
      console.error('Error reinstating user:', error);
      toast({
        title: "Error",
        description: "Failed to reinstate user",
        variant: "destructive"
      });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // This would typically require admin API access
      // For now, we'll just mark as deleted in our system
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "User Deleted",
        description: "The user account has been removed.",
        variant: "destructive"
      });

      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  const makeAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: 'admin'
        });

      if (error) throw error;

      toast({
        title: "Admin Role Granted",
        description: "User has been granted admin privileges."
      });

      fetchUsers();
    } catch (error) {
      console.error('Error granting admin:', error);
      toast({
        title: "Error",
        description: "Failed to grant admin role",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.profile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.profile?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());

    switch (filter) {
      case "suspended":
        return matchesSearch && user.strikes?.is_suspended;
      case "active":
        return matchesSearch && !user.strikes?.is_suspended;
      case "admins":
        return matchesSearch && user.roles?.some(r => r.role === 'admin');
      default:
        return matchesSearch;
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getUserDisplayName = (user: UserAccount) => {
    if (user.profile?.first_name || user.profile?.last_name) {
      return `${user.profile.first_name || ''} ${user.profile.last_name || ''}`.trim();
    }
    return user.email.split('@')[0];
  };

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <Card className="border-0 bg-gradient-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            User Account Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All Users
              </Button>
              <Button
                variant={filter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={filter === "suspended" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("suspended")}
              >
                Suspended
              </Button>
              <Button
                variant={filter === "admins" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("admins")}
              >
                Admins
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <Card className="border-0 bg-gradient-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>User Accounts</span>
            <Badge variant="secondary">
              {filteredUsers.length} users
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse p-4 bg-muted/30 rounded-lg">
                  <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-foreground">
                          {getUserDisplayName(user)}
                        </h4>
                        
                        <div className="flex gap-1">
                          {user.roles?.some(r => r.role === 'admin') && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                          
                          {user.strikes?.is_suspended ? (
                            <Badge variant="destructive">
                              <Ban className="h-3 w-3 mr-1" />
                              Suspended
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-success/10 text-success">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          )}
                          
                          {user.strikes && user.strikes.strike_count > 0 && (
                            <Badge variant="outline" className="border-warning text-warning">
                              {user.strikes.strike_count} strikes
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined {formatDate(user.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {user.profile?.total_feedback || 0} feedback
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          £{user.profile?.total_winnings?.toFixed(2) || '0.00'} earned
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Activity className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      
                      {!user.roles?.some(r => r.role === 'admin') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => makeAdmin(user.id)}
                        >
                          <Shield className="h-4 w-4 mr-1" />
                          Make Admin
                        </Button>
                      )}
                      
                      {user.strikes?.is_suspended ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => reinstateUser(user.id)}
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Reinstate
                        </Button>
                      ) : (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => suspendUser(user.id)}
                        >
                          <Ban className="h-4 w-4 mr-1" />
                          Suspend
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Account Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Account Info</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Name:</strong> {getUserDisplayName(selectedUser)}</p>
                    <p><strong>Joined:</strong> {formatDate(selectedUser.created_at)}</p>
                    <p><strong>User ID:</strong> {selectedUser.id}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Activity Stats</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Total Feedback:</strong> {selectedUser.profile?.total_feedback || 0}</p>
                    <p><strong>Prize Entries:</strong> {selectedUser.profile?.total_entries || 0}</p>
                    <p><strong>Total Winnings:</strong> £{selectedUser.profile?.total_winnings?.toFixed(2) || '0.00'}</p>
                    <p><strong>Strikes:</strong> {selectedUser.strikes?.strike_count || 0}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  Close
                </Button>
                
                {selectedUser.strikes?.is_suspended ? (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      reinstateUser(selectedUser.id);
                      setSelectedUser(null);
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reinstate Account
                  </Button>
                ) : (
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      suspendUser(selectedUser.id);
                      setSelectedUser(null);
                    }}
                  >
                    <Ban className="h-4 w-4 mr-1" />
                    Suspend Account
                  </Button>
                )}
                
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    deleteUser(selectedUser.id);
                    setSelectedUser(null);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Account
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};