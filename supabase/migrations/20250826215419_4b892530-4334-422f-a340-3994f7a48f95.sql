-- Create user roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create home_media table for storing home screen media
CREATE TABLE public.home_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    step_number INTEGER NOT NULL CHECK (step_number IN (1, 2, 3)),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (step_number) -- Only one media per step
);

-- Enable RLS on home_media
ALTER TABLE public.home_media ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for home_media
CREATE POLICY "Anyone can view home media"
ON public.home_media
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only admins can manage home media"
ON public.home_media
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create storage buckets for home media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('home-media', 'home-media', true);

-- Storage policies for home media bucket
CREATE POLICY "Anyone can view home media files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'home-media');

CREATE POLICY "Only admins can upload home media files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'home-media' 
    AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Only admins can update home media files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'home-media' 
    AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Only admins can delete home media files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'home-media' 
    AND public.has_role(auth.uid(), 'admin')
);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for home_media updated_at
CREATE TRIGGER update_home_media_updated_at
    BEFORE UPDATE ON public.home_media
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();