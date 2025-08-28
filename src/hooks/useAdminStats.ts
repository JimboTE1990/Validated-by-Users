import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  activeUsers: number;
  flaggedPosts: number;
  userReports: number;
  strikeActions: number;
  totalPosts: number;
  totalComments: number;
  suspendedUsers: number;
  moderationActions: number;
}

interface TimeframeSummary {
  timeframe: string;
  newUsers: number;
  newPosts: number;
  newComments: number;
  moderationActions: number;
  reportedContent: number;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    activeUsers: 0,
    flaggedPosts: 0,
    userReports: 0,
    strikeActions: 0,
    totalPosts: 0,
    totalComments: 0,
    suspendedUsers: 0,
    moderationActions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get user count (from profiles table as proxy for active users)
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get posts count
      const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true });

      // Get comments count
      const { count: commentsCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true });

      // Get flagged posts (posts with reported comments)
      const { count: flaggedPostsCount } = await supabase
        .from('comments')
        .select('post_id', { count: 'exact', head: true })
        .eq('report_status', 'reported_for_review');

      // Get pending feedback reports
      const { count: userReportsCount } = await supabase
        .from('feedback_reports')
        .select('*', { count: 'exact', head: true });

      // Get suspended users
      const { count: suspendedUsersCount } = await supabase
        .from('user_strikes')
        .select('*', { count: 'exact', head: true })
        .eq('is_suspended', true);

      // Get recent strike actions (last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { count: strikeActionsCount } = await supabase
        .from('user_strikes')
        .select('*', { count: 'exact', head: true })
        .gte('last_strike_at', yesterday.toISOString());

      // Get moderation actions from moderated_content table
      const { count: moderationActionsCount } = await supabase
        .from('moderated_content')
        .select('*', { count: 'exact', head: true });

      setStats({
        activeUsers: userCount || 0,
        flaggedPosts: flaggedPostsCount || 0,
        userReports: userReportsCount || 0,
        strikeActions: strikeActionsCount || 0,
        totalPosts: postsCount || 0,
        totalComments: commentsCount || 0,
        suspendedUsers: suspendedUsersCount || 0,
        moderationActions: moderationActionsCount || 0
      });

    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTimeframeSummary = async (timeframe: 'today' | 'week' | 'month' = 'today'): Promise<TimeframeSummary | null> => {
    try {
      const now = new Date();
      const startDate = new Date();
      
      switch (timeframe) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setDate(now.getDate() - 30);
          break;
      }

      // Get new users
      const { count: newUsersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());

      // Get new posts
      const { count: newPostsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());

      // Get new comments
      const { count: newCommentsCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());

      // Get moderation actions in timeframe
      const { count: moderationActionsCount } = await supabase
        .from('moderated_content')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());

      // Get reported content in timeframe
      const { count: reportedContentCount } = await supabase
        .from('feedback_reports')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());

      return {
        timeframe,
        newUsers: newUsersCount || 0,
        newPosts: newPostsCount || 0,
        newComments: newCommentsCount || 0,
        moderationActions: moderationActionsCount || 0,
        reportedContent: reportedContentCount || 0
      };

    } catch (err) {
      console.error('Error getting timeframe summary:', err);
      return null;
    }
  };

  // Get recent activity for the activity feed
  const getRecentActivity = async (limit: number = 10) => {
    try {
      // Get recent moderation actions
      const { data: moderationData } = await supabase
        .from('moderated_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      // Get recent reports
      const { data: reportsData } = await supabase
        .from('feedback_reports')
        .select(`
          *,
          comments:comment_id (
            content,
            posts:post_id (
              title
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      // Get recent admin activity logs
      const { data: adminActivity } = await supabase
        .from('admin_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      // Combine and sort all activities by timestamp
      const allActivities = [
        ...(moderationData || []).map(item => ({
          type: 'moderation',
          action: item.action_taken,
          details: `${item.classification} content ${item.action_taken}`,
          timestamp: item.created_at
        })),
        ...(reportsData || []).map(item => ({
          type: 'report',
          action: 'report_received',
          details: `Report: ${item.report_reason}`,
          timestamp: item.created_at
        })),
        ...(adminActivity || []).map(item => ({
          type: 'admin',
          action: item.action_type,
          details: `Admin: ${item.action_type.replace(/_/g, ' ')}`,
          timestamp: item.created_at
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);

      return allActivities;

    } catch (err) {
      console.error('Error getting recent activity:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    fetchStats,
    getTimeframeSummary,
    getRecentActivity
  };
};