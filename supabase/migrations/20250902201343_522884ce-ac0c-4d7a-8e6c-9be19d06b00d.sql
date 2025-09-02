-- Add auto-extension fields to posts table for new winner selection system
ALTER TABLE public.posts 
ADD COLUMN extension_count integer DEFAULT 0,
ADD COLUMN min_entries_threshold integer DEFAULT 1,
ADD COLUMN original_end_date timestamp with time zone,
ADD COLUMN extension_reason text;

-- Update existing posts to set original_end_date to current end_date
UPDATE public.posts 
SET original_end_date = end_date 
WHERE original_end_date IS NULL;

-- Set minimum entry thresholds based on prize pool tiers
UPDATE public.posts 
SET min_entries_threshold = CASE 
  WHEN prize_pool <= 10 THEN 1
  WHEN prize_pool <= 50 THEN 2  
  ELSE 3
END;