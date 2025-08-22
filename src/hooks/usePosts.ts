import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
}

export interface PostWithComments extends Post {
  comments: Array<{
    id: string;
    content: string;
    likes: number;
    is_boosted: boolean;
    created_at: string;
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

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          category:categories(name),
          author:profiles(first_name, last_name, avatar_url)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, error, refetch: fetchPosts };
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