import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface ModerationResult {
  classification: "valid" | "spam";
  reason: string;
  action: "keep" | "remove" | "suspend";
  strike_level: number;
  user_message: string;
}

export const useModeration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const classifyContent = (content: string): { classification: "valid" | "spam"; reason: string } => {
    const trimmedContent = content.trim().toLowerCase();
    
    // Check for random/nonsensical text (high percentage of consonants in a row, random characters)
    const randomPattern = /[bcdfghjklmnpqrstvwxyz]{4,}|[aeiou]{4,}|[^a-zA-Z0-9\s]{3,}/i;
    if (randomPattern.test(trimmedContent) && trimmedContent.length < 50) {
      return {
        classification: "spam",
        reason: "Content appears to contain random or nonsensical text"
      };
    }

    // Check for very short/vague responses
    const vaguePhrases = [
      "ok", "good", "nice", "cool", "great", "yes", "no", "thanks", "thx",
      "awesome", "lol", "haha", "wow", "meh", "nah", "yep", "sure", "fine"
    ];
    
    if (trimmedContent.length < 10 && vaguePhrases.includes(trimmedContent)) {
      return {
        classification: "spam", 
        reason: "Content is too vague or short to provide actionable feedback"
      };
    }

    // Check for repetitive patterns (same word/phrase repeated)
    const words = trimmedContent.split(/\s+/);
    if (words.length > 3) {
      const wordCounts = words.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const repeatedWords = Object.values(wordCounts).filter(count => count > 3);
      if (repeatedWords.length > 0) {
        return {
          classification: "spam",
          reason: "Content contains excessive repetition"
        };
      }
    }

    // Check for generic copy-paste phrases
    const genericPhrases = [
      "this is great", "looks good", "i like it", "not bad", "could be better",
      "nice work", "keep it up", "well done", "not for me", "interesting idea"
    ];
    
    const hasGenericPhrase = genericPhrases.some(phrase => 
      trimmedContent.includes(phrase) && trimmedContent.length < phrase.length + 20
    );
    
    if (hasGenericPhrase) {
      return {
        classification: "spam",
        reason: "Content appears to be generic or copy-pasted feedback"
      };
    }

    // Content passes all spam checks
    return {
      classification: "valid",
      reason: "Content appears to be genuine, relevant feedback"
    };
  };

  const getUserStrikes = async (userId: string): Promise<number> => {
    const { data, error } = await supabase
      .from("user_strikes")
      .select("strike_count, is_suspended")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user strikes:", error);
      return 0;
    }

    if (data?.is_suspended) {
      throw new Error("Account is suspended");
    }

    return data?.strike_count || 0;
  };

  const moderateContent = async (
    content: string,
    postId: string
  ): Promise<ModerationResult> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { classification, reason } = classifyContent(content);
    
    if (classification === "valid") {
      // Log the moderation result
      await supabase
        .from("moderated_content")
        .insert({
          user_id: user.id,
          content,
          classification,
          reason,
          action_taken: "keep",
          strike_level: 0,
          related_post_id: postId
        });

      return {
        classification: "valid",
        reason,
        action: "keep",
        strike_level: 0,
        user_message: ""
      };
    }

    // Content is spam - get current strikes and increment
    const currentStrikes = await getUserStrikes(user.id);
    const newStrikeLevel = currentStrikes + 1;

    // Increment strikes in database
    const { data: strikeResult, error: strikeError } = await supabase
      .rpc("increment_user_strike", { target_user_id: user.id });

    if (strikeError) {
      console.error("Error incrementing strikes:", strikeError);
      throw new Error("Failed to process moderation action");
    }

    const { new_strike_count, is_suspended } = strikeResult[0];
    
    // Log the moderation action
    await supabase
      .from("moderated_content")
      .insert({
        user_id: user.id,
        content,
        classification,
        reason,
        action_taken: is_suspended ? "suspend" : "remove",
        strike_level: new_strike_count,
        related_post_id: postId
      });

    // Generate appropriate user message based on strike level
    let userMessage = "";
    let action: "remove" | "suspend" = "remove";

    if (is_suspended) {
      action = "suspend";
      userMessage = "🚫 Your account has been suspended for repeated spam. Contact support if you believe this is an error.";
      
      // Show suspension toast
      toast({
        title: "Account Suspended",
        description: userMessage,
        variant: "destructive",
      });
    } else if (new_strike_count === 1) {
      userMessage = "⚠️ Your post has been removed due to suspected spam. Please ensure feedback is specific & relevant, as agreed in our terms of service.";
    } else if (new_strike_count === 2) {
      userMessage = "⚠️ This is your second spam warning. Continued misuse may lead to account suspension.";
    }

    // Show warning toast for strikes 1 and 2
    if (!is_suspended) {
      toast({
        title: "Content Removed",
        description: userMessage,
        variant: "destructive",
      });
    }

    return {
      classification: "spam",
      reason,
      action,
      strike_level: new_strike_count,
      user_message: userMessage
    };
  };

  const checkUserStatus = async (): Promise<{ isSuspended: boolean }> => {
    if (!user) return { isSuspended: false };

    const { data, error } = await supabase
      .from("user_strikes")
      .select("is_suspended")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error checking user suspension:", error);
      return { isSuspended: false };
    }

    return { isSuspended: data?.is_suspended || false };
  };

  const checkUserSuspension = async (): Promise<boolean> => {
    if (!user) return false;

    const { data, error } = await supabase
      .from("user_strikes")
      .select("is_suspended")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error checking user suspension:", error);
      return false;
    }

    return data?.is_suspended || false;
  };

  return {
    moderateContent,
    checkUserStatus,
    checkUserSuspension,
    getUserStrikes,
    isProcessing
  };
};