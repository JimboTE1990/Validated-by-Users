import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserReview {
  id: string;
  content: string;
  post_id: string;
  post_title: string;
  created_at: string;
  report_status: string;
  is_reported_by_author: boolean;
  report_reason?: string;
}

export interface UserWarning {
  id: string;
  content: string;
  classification: string;
  reason: string;
  action_taken: string;
  strike_level: number;
  created_at: string;
  related_post_id?: string;
}

export interface UserStrikeInfo {
  strike_count: number;
  is_suspended: boolean;
  last_strike_at?: string;
}

export const useUserReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [warnings, setWarnings] = useState<UserWarning[]>([]);
  const [strikeInfo, setStrikeInfo] = useState<UserStrikeInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user's comments/reviews
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select(`
            id,
            content,
            post_id,
            created_at,
            report_status,
            is_reported_by_author,
            report_reason,
            posts(title)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (commentsError) {
          console.error('Error fetching user comments:', commentsError);
        } else {
          const formattedReviews: UserReview[] = commentsData?.map(comment => ({
            id: comment.id,
            content: comment.content,
            post_id: comment.post_id,
            post_title: (comment.posts as any)?.title || 'Unknown Post',
            created_at: comment.created_at,
            report_status: comment.report_status,
            is_reported_by_author: comment.is_reported_by_author,
            report_reason: comment.report_reason
          })) || [];
          setReviews(formattedReviews);
        }

        // Fetch user's moderation warnings
        const { data: moderationData, error: moderationError } = await supabase
          .from('moderated_content')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (moderationError) {
          console.error('Error fetching moderation data:', moderationError);
        } else {
          setWarnings(moderationData || []);
        }

        // Fetch user's strike information
        const { data: strikeData, error: strikeError } = await supabase
          .from('user_strikes')
          .select('strike_count, is_suspended, last_strike_at')
          .eq('user_id', user.id)
          .maybeSingle();

        if (strikeError) {
          console.error('Error fetching strike data:', strikeError);
        } else {
          setStrikeInfo(strikeData || { strike_count: 0, is_suspended: false });
        }
      } catch (error) {
        console.error('Error fetching user review data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  return {
    reviews,
    warnings,
    strikeInfo,
    loading
  };
};