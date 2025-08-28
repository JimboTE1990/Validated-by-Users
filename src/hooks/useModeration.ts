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

  const classifyContent = (content: string, isEdit: boolean = false, previousContent: string = ""): { classification: "valid" | "spam"; reason: string } => {
    const trimmedContent = content.trim().toLowerCase();
    
    // For edits, calculate similarity to previous content
    if (isEdit && previousContent) {
      const prevTrimmed = previousContent.trim().toLowerCase();
      const similarity = calculateSimilarity(prevTrimmed, trimmedContent);
      
      // If content is very similar (>70% similarity), be more lenient
      if (similarity > 0.7) {
        // Only check for the most obvious spam patterns on edits
        const obviousSpamPattern = /[bcdfghjklmnpqrstvwxyz]{6,}|[^a-zA-Z0-9\s]{5,}/i;
        if (obviousSpamPattern.test(trimmedContent) && trimmedContent.length < 30) {
          return {
            classification: "spam",
            reason: "Content contains obvious spam patterns"
          };
        }
        
        // For similar edits, assume it's legitimate (typo fixes, etc.)
        return {
          classification: "valid",
          reason: "Edit appears to be minor corrections to existing content"
        };
      }
    }

    // Check for random/nonsensical text (high percentage of consonants in a row, random characters)
    const randomPattern = /[bcdfghjklmnpqrstvwxyz]{4,}|[aeiou]{4,}|[^a-zA-Z0-9\s]{3,}/i;
    if (randomPattern.test(trimmedContent) && trimmedContent.length < 50) {
      return {
        classification: "spam",
        reason: "Content appears to contain random or nonsensical text"
      };
    }

    // Check for very short/vague responses (be more lenient for edits)
    const vaguePhrases = [
      "ok", "good", "nice", "cool", "great", "yes", "no", "thanks", "thx",
      "awesome", "lol", "haha", "wow", "meh", "nah", "yep", "sure", "fine"
    ];
    
    const minLength = isEdit ? 5 : 10; // More lenient for edits
    if (trimmedContent.length < minLength && vaguePhrases.includes(trimmedContent)) {
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
      
      const repeatedWords = Object.values(wordCounts).filter(count => count > (isEdit ? 4 : 3)); // More lenient for edits
      if (repeatedWords.length > 0) {
        return {
          classification: "spam",
          reason: "Content contains excessive repetition"
        };
      }
    }

    // Check for generic copy-paste phrases (skip for edits if content is similar to previous)
    if (!isEdit) {
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
    }

    // Content passes all spam checks
    return {
      classification: "valid",
      reason: "Content appears to be genuine, relevant feedback"
    };
  };

  // Helper function to calculate similarity between two strings
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  };

  // Helper function to calculate Levenshtein distance
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
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
    postId: string,
    isEdit: boolean = false,
    previousContent: string = ""
  ): Promise<ModerationResult> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { classification, reason } = classifyContent(content, isEdit, previousContent);
    
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

    // For edits that are flagged as spam, don't increment strikes immediately
    // Instead, give a warning first
    if (isEdit) {
      const currentStrikes = await getUserStrikes(user.id);
      
      // Log the moderation action but don't increment strikes for first edit offense
      await supabase
        .from("moderated_content")
        .insert({
          user_id: user.id,
          content,
          classification,
          reason,
          action_taken: "remove",
          strike_level: currentStrikes,
          related_post_id: postId
        });

      // Show a gentler warning for edits
      const userMessage = "⚠️ Your edit appears to contain problematic content. Please ensure edits maintain quality feedback standards.";
      
      toast({
        title: "Edit Rejected",
        description: userMessage,
        variant: "destructive",
      });

      return {
        classification: "spam",
        reason,
        action: "remove",
        strike_level: currentStrikes,
        user_message: userMessage
      };
    }

    // Content is spam for new submissions - get current strikes and increment
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