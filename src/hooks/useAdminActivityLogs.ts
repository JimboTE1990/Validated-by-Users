import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminActivityLog {
  id: string;
  admin_user_id: string;
  action_type: string;
  resource_type?: string;
  resource_id?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

interface AdminActivityFilters {
  actionType?: string;
  resourceType?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export const useAdminActivityLogs = () => {
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async (filters: AdminActivityFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('admin_activity_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.actionType) {
        query = query.eq('action_type', filters.actionType);
      }

      if (filters.resourceType) {
        query = query.eq('resource_type', filters.resourceType);
      }

      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }

      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setLogs((data || []).map(log => ({
        ...log,
        ip_address: log.ip_address?.toString() || undefined,
        user_agent: log.user_agent || undefined,
        resource_type: log.resource_type || undefined,
        resource_id: log.resource_id || undefined
      })));
    } catch (err) {
      console.error('Error fetching admin activity logs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getLogSummary = async (timeframe: 'day' | 'week' | 'month' = 'day') => {
    try {
      const now = new Date();
      const startDate = new Date();
      
      switch (timeframe) {
        case 'day':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setDate(now.getDate() - 30);
          break;
      }

      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select('action_type')
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      // Count actions by type
      const summary = data?.reduce((acc, log) => {
        acc[log.action_type] = (acc[log.action_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      return {
        total: data?.length || 0,
        byAction: summary,
        timeframe
      };
    } catch (err) {
      console.error('Error getting log summary:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchLogs({ limit: 50 }); // Load recent logs on mount
  }, []);

  return {
    logs,
    loading,
    error,
    fetchLogs,
    getLogSummary,
    refetch: () => fetchLogs({ limit: 50 })
  };
};