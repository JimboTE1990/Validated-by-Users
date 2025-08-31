import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserPost {
  id: string;
  title: string;
  description: string;
  prize_pool: number;
  start_date: string;
  end_date: string;
  status: string;
  current_entries: number;
  max_entries: number;
  created_at: string;
  category: {
    name: string;
  } | null;
  comment_count: number;
  engagement_stats: {
    total_comments: number;
    total_entries: number;
    active_commenters: number;
    boosted_comments: number;
  };
}

export const useUserPosts = () => {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchUserPosts = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch posts created by the current user with engagement metrics
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          description,
          prize_pool,
          start_date,
          end_date,
          status,
          current_entries,
          max_entries,
          created_at,
          category:categories(name)
        `)
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (postsError) {
        throw postsError;
      }

      // For each post, fetch engagement statistics
      const postsWithEngagement = await Promise.all(
        (postsData || []).map(async (post) => {
          // Get comment count and engagement stats
          const { data: comments, error: commentsError } = await supabase
            .from('comments')
            .select('id, user_id, is_boosted')
            .eq('post_id', post.id)
            .eq('report_status', 'active');

          if (commentsError) {
            console.error('Error fetching comments:', commentsError);
          }

          // Get entries count
          const { data: entries, error: entriesError } = await supabase
            .from('user_activities')
            .select('id, user_id')
            .eq('post_id', post.id)
            .eq('activity_type', 'entry');

          if (entriesError) {
            console.error('Error fetching entries:', entriesError);
          }

          const commentCount = comments?.length || 0;
          const entriesCount = entries?.length || 0;
          const uniqueCommenters = new Set(comments?.map(c => c.user_id) || []).size;
          const boostedCommentsCount = comments?.filter(c => c.is_boosted)?.length || 0;

          return {
            ...post,
            comment_count: commentCount,
            engagement_stats: {
              total_comments: commentCount,
              total_entries: entriesCount,
              active_commenters: uniqueCommenters,
              boosted_comments: boostedCommentsCount,
            }
          } as UserPost;
        })
      );

      setPosts(postsWithEngagement);
    } catch (err) {
      console.error('Error fetching user posts:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const boostComment = async (postId: string, commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ is_boosted: true })
        .eq('id', commentId)
        .eq('post_id', postId);

      if (error) {
        throw error;
      }

      // Refresh posts to update engagement stats
      await fetchUserPosts();
      
      return { success: true };
    } catch (err) {
      console.error('Error boosting comment:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  };

  const getTimeLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
    return 'Ending soon';
  };

  useEffect(() => {
    fetchUserPosts();
  }, [user?.id]);

  return {
    posts,
    loading,
    error,
    refetch: fetchUserPosts,
    boostComment,
    getTimeLeft
  };
};