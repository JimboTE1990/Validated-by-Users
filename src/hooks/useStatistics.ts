import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Statistics {
  totalPrizePools: number;
  productsValidated: number;
  monthlyActiveUsers?: number;
}

export const useStatistics = () => {
  const [stats, setStats] = useState<Statistics>({
    totalPrizePools: 0,
    productsValidated: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch baseline values from site_statistics
      const { data: baselineData, error: baselineError } = await supabase
        .from('site_statistics')
        .select('total_prize_pools_baseline, products_validated_baseline, active_users_baseline')
        .limit(1)
        .single();

      if (baselineError && baselineError.code !== 'PGRST116') {
        throw baselineError;
      }

      // Fetch real-time data from posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('prize_pool');

      if (postsError) throw postsError;

      // Fetch MAU from user_activities (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: mauData, error: mauError } = await supabase
        .from('user_activities')
        .select('user_id')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (mauError) throw mauError;

      // Calculate totals
      const realTimePrizePools = postsData?.reduce((sum, post) => sum + Number(post.prize_pool || 0), 0) || 0;
      const realTimeProductsValidated = postsData?.length || 0;
      const uniqueActiveUsers = mauData ? new Set(mauData.map(activity => activity.user_id)).size : 0;

      const baselinePrizePools = baselineData?.total_prize_pools_baseline || 0;
      const baselineProducts = baselineData?.products_validated_baseline || 0;
      const baselineUsers = baselineData?.active_users_baseline || 0;

      setStats({
        totalPrizePools: realTimePrizePools + Number(baselinePrizePools),
        productsValidated: realTimeProductsValidated + Number(baselineProducts),
        monthlyActiveUsers: uniqueActiveUsers + Number(baselineUsers) >= 500 
          ? uniqueActiveUsers + Number(baselineUsers) 
          : undefined,
      });
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refetch: fetchStatistics };
};