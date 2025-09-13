import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  avatar_url?: string;
  total_winnings: number;
  total_entries: number;
  total_feedback: number;
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  activity_type: string;
  reward_amount?: number;
  reward_description?: string;
  status: string;
  created_at: string;
  post: {
    title: string;
  };
}

export const useProfile = (userId?: string) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      const { data: activitiesData, error: activitiesError } = await supabase
        .from('user_activities')
        .select(`
          *,
          post:posts(title)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (activitiesError) throw activitiesError;

      setProfile(profileData);
      setActivities(activitiesData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      
      // Refetch profile data
      await fetchProfile();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return { profile, activities, loading, error, updateProfile, refetch: fetchProfile };
};