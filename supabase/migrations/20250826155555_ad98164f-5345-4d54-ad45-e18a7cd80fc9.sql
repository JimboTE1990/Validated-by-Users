-- Create site_statistics table for managing baseline values
CREATE TABLE public.site_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_prize_pools_baseline NUMERIC NOT NULL DEFAULT 0,
  products_validated_baseline INTEGER NOT NULL DEFAULT 0,
  active_users_baseline INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_statistics ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing statistics (public read)
CREATE POLICY "Site statistics are viewable by everyone" 
ON public.site_statistics 
FOR SELECT 
USING (true);

-- Insert initial baseline values (you can update these later for production reset)
INSERT INTO public.site_statistics (
  total_prize_pools_baseline,
  products_validated_baseline,
  active_users_baseline
) VALUES (0, 0, 0);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_site_statistics_updated_at
BEFORE UPDATE ON public.site_statistics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();