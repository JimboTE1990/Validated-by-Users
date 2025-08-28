import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Shield,
  Activity,
  AlertTriangle,
  Clock,
  Eye,
  Filter,
  RefreshCw,
  Download,
  Search
} from 'lucide-react';
import { useAdminActivityLogs } from '@/hooks/useAdminActivityLogs';
import { useAdminSecurity } from '@/hooks/useAdminSecurity';
import { toast } from '@/hooks/use-toast';

export const AdminSecurityPanel = () => {
  const { logs, loading, fetchLogs, getLogSummary } = useAdminActivityLogs();
  const { lastActivity } = useAdminSecurity();
  const [summary, setSummary] = useState<any>(null);
  const [filters, setFilters] = useState({
    actionType: '',
    resourceType: '',
    startDate: '',
    endDate: '',
    search: ''
  });

  useEffect(() => {
    const loadSummary = async () => {
      const data = await getLogSummary('day');
      setSummary(data);
    };
    loadSummary();
  }, [getLogSummary]);

  const handleFilter = () => {
    const filterParams = {
      ...(filters.actionType && { actionType: filters.actionType }),
      ...(filters.resourceType && { resourceType: filters.resourceType }),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
      limit: 100
    };
    fetchLogs(filterParams);
  };

  const clearFilters = () => {
    setFilters({
      actionType: '',
      resourceType: '',
      startDate: '',
      endDate: '',
      search: ''
    });
    fetchLogs({ limit: 50 });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes('delete') || action.includes('remove') || action.includes('suspend')) {
      return 'destructive';
    }
    if (action.includes('create') || action.includes('approve')) {
      return 'default';
    }
    if (action.includes('access') || action.includes('view')) {
      return 'secondary';
    }
    return 'outline';
  };

  const filteredLogs = logs.filter(log => 
    !filters.search || 
    log.action_type.toLowerCase().includes(filters.search.toLowerCase()) ||
    log.resource_type?.toLowerCase().includes(filters.search.toLowerCase())
  );

  const exportLogs = () => {
    const csvContent = [
      ['Date', 'Action', 'Resource Type', 'Resource ID', 'IP Address', 'User Agent'].join(','),
      ...filteredLogs.map(log => [
        formatDate(log.created_at),
        log.action_type,
        log.resource_type || '',
        log.resource_id || '',
        log.ip_address || '',
        log.user_agent || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Admin activity logs have been downloaded."
    });
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 bg-gradient-card shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Session Status</p>
                <p className="text-2xl font-bold text-success">Active</p>
                <p className="text-xs text-muted-foreground">
                  Last: {lastActivity ? formatDate(lastActivity.toISOString()) : 'N/A'}
                </p>
              </div>
              <Shield className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-card shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Actions</p>
                <p className="text-2xl font-bold text-foreground">{summary?.total || 0}</p>
                <p className="text-xs text-success">+{summary?.byAction?.admin_dashboard_access || 0} logins</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-card shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Security Alerts</p>
                <p className="text-2xl font-bold text-warning">2</p>
                <p className="text-xs text-warning">OTP & Password Protection</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Logs */}
      <Card className="border-0 bg-gradient-card shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Admin Activity Logs
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchLogs({ limit: 50 })}
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportLogs}
                disabled={logs.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="logs" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="logs">Activity Logs</TabsTrigger>
              <TabsTrigger value="filters">Filters & Search</TabsTrigger>
            </TabsList>
            
            <TabsContent value="filters" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search actions..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Action Type</Label>
                  <Select
                    value={filters.actionType}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, actionType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All actions</SelectItem>
                      <SelectItem value="admin_dashboard_access">Dashboard Access</SelectItem>
                      <SelectItem value="admin_tab_navigation">Tab Navigation</SelectItem>
                      <SelectItem value="content_management">Content Management</SelectItem>
                      <SelectItem value="user_moderation">User Moderation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={filters.startDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={filters.endDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleFilter} disabled={loading}>
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="logs">
              <ScrollArea className="h-[600px] w-full">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : filteredLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No activity logs found
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <Badge variant={getActionBadgeColor(log.action_type)}>
                            {log.action_type.replace(/_/g, ' ')}
                          </Badge>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {log.resource_type && (
                                <span className="text-sm text-muted-foreground">
                                  {log.resource_type}
                                </span>
                              )}
                              {log.resource_id && (
                                <span className="text-xs text-muted-foreground font-mono">
                                  {log.resource_id.slice(0, 8)}...
                                </span>
                              )}
                            </div>
                            
                            {log.details && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {typeof log.details === 'object' 
                                  ? JSON.stringify(log.details, null, 2).slice(0, 100) + '...'
                                  : log.details
                                }
                              </div>
                            )}
                            
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              {log.ip_address && (
                                <span>IP: {log.ip_address}</span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(log.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};