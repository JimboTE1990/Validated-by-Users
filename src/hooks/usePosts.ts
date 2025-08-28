import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Post {
  id: string;
  title: string;
  description: string;
  full_description?: string;
  product_link?: string;
  prize_pool: number;
  category_id: string;
  author_id: string;
  start_date: string;
  end_date: string;
  status: string;
  max_entries: number;
  current_entries: number;
  created_at: string;
  updated_at: string;
  category: {
    name: string;
  };
  author: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  user_entry?: {
    id: string;
    is_boosted: boolean;
  } | null;
}

export interface PostWithComments extends Post {
  comments: Array<{
    id: string;
    content: string;
    likes: number;
    is_boosted: boolean;
    created_at: string;
    user_id: string;
    user: {
      first_name: string;
      last_name: string;
      avatar_url?: string;
    };
  }>;
  images: Array<{
    id: string;
    image_url: string;
    image_type: string;
  }>;
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('posts')
        .select(`
          *,
          category:categories(name),
          author:profiles(first_name, last_name, avatar_url)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      const { data: postsData, error: postsError } = await query;
      if (postsError) throw postsError;

      // Fetch user entries if user is logged in
      let postsWithEntries = postsData || [];
      if (user && postsData) {
        const { data: entriesData } = await supabase
          .from('user_activities')
          .select('id, post_id, activity_type')
          .eq('user_id', user.id)
          .eq('activity_type', 'entry')
          .in('post_id', postsData.map(p => p.id));

        // Check for user comments (actual feedback submitted)
        const { data: commentsData } = await supabase
          .from('comments')
          .select('post_id, is_boosted')
          .eq('user_id', user.id)
          .in('post_id', postsData.map(p => p.id));

        postsWithEntries = postsData.map(post => {
          const userComment = commentsData?.find(c => c.post_id === post.id);
          return {
            ...post,
            user_entry: userComment ? {
              id: entriesData?.find(e => e.post_id === post.id)?.id || 'comment-entry',
              is_boosted: userComment.is_boosted || false
            } : null
          };
        });
      }

      setPosts(postsWithEntries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const enterDraw = async (postId: string) => {
    if (!user) {
      throw new Error('Must be logged in to enter');
    }

    // Check if user already entered
    const { data: existingEntry } = await supabase
      .from('user_activities')
      .select('id')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .eq('activity_type', 'entry')
      .single();

    if (existingEntry) {
      throw new Error('You have already entered this draw');
    }

    // Create entry
    const { error } = await supabase
      .from('user_activities')
      .insert({
        user_id: user.id,
        post_id: postId,
        activity_type: 'entry'
        // status defaults to 'pending' which is allowed by the constraint
      });

    if (error) throw error;

    // Refresh posts to update entry status
    await fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, [user?.id]);

  return { posts, loading, error, refetch: fetchPosts, enterDraw };
};

export const usePost = (id: string) => {
  const [post, setPost] = useState<PostWithComments | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          category:categories(name),
          author:profiles(first_name, last_name, avatar_url),
          comments(
            id,
            content,
            likes,
            is_boosted,
            created_at,
            user_id,
            user:profiles(first_name, last_name, avatar_url)
          ),
          images:post_images(id, image_url, image_type)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  return { post, loading, error, refetch: fetchPost };
};