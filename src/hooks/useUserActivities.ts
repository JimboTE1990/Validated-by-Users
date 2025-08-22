import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserActivity {
  id: string;
  activity_type: string;
  reward_description: string | null;
  reward_amount: number | null;
  status: string;
  created_at: string;
  post: {
    id: string;
    title: string;
    description: string;
    prize_pool: number;
    end_date: string;
    status: string;
  };
}

export interface ActivePool {
  id: string;
  title: string;
  description: string;
  prize_pool: number;
  end_date: string;
  status: string;
  current_entries: number;
  max_entries: number;
  category: {
    name: string;
  } | null;
  user_participated: boolean;
}

export const useUserActivities = (userId: string | undefined) => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [activePools, setActivePools] = useState<ActivePool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchActivities = async () => {
      try {
        setLoading(true);
        
        // Fetch user activities with post details
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('user_activities')
          .select(`
            id,
            activity_type,
            reward_description,
            reward_amount,
            status,
            created_at,
            post_id,
            posts (
              id,
              title,
              description,
              prize_pool,
              end_date,
              status
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (activitiesError) {
          throw activitiesError;
        }

        // Transform the data to match our interface
        const transformedActivities = activitiesData?.map(activity => ({
          id: activity.id,
          activity_type: activity.activity_type,
          reward_description: activity.reward_description,
          reward_amount: activity.reward_amount,
          status: activity.status,
          created_at: activity.created_at,
          post: {
            id: activity.posts?.id || '',
            title: activity.posts?.title || 'Unknown Post',
            description: activity.posts?.description || '',
            prize_pool: activity.posts?.prize_pool || 0,
            end_date: activity.posts?.end_date || '',
            status: activity.posts?.status || 'unknown'
          }
        })) || [];

        setActivities(transformedActivities);

        // Fetch active pools (posts where user has participated and are still active)
        const { data: activePoolsData, error: poolsError } = await supabase
          .from('posts')
          .select(`
            id,
            title,
            description,
            prize_pool,
            end_date,
            status,
            current_entries,
            max_entries,
            categories (
              name
            ),
            user_activities!inner (
              user_id
            )
          `)
          .eq('user_activities.user_id', userId)
          .eq('status', 'active')
          .gt('end_date', new Date().toISOString())
          .order('end_date', { ascending: true });

        if (poolsError) {
          throw poolsError;
        }

        const transformedPools = activePoolsData?.map(pool => ({
          id: pool.id,
          title: pool.title,
          description: pool.description,
          prize_pool: pool.prize_pool,
          end_date: pool.end_date,
          status: pool.status,
          current_entries: pool.current_entries || 0,
          max_entries: pool.max_entries || 100,
          category: pool.categories,
          user_participated: true
        })) || [];

        setActivePools(transformedPools);
        
      } catch (err) {
        console.error('Error fetching user activities:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [userId]);

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

  return {
    activities,
    activePools,
    loading,
    error,
    getTimeLeft
  };
};