interface ModerationResult {
  classification: 'valid' | 'spam';
  reason: string;
  action: 'keep' | 'remove' | 'suspend';
  strike_level: number;
  user_message: string;
}

export class ModerationService {
  
  private static isSpam(content: string): { isSpam: boolean; reason: string } {
    const trimmedContent = content.trim().toLowerCase();
    
    // Check for random or nonsensical text
    const hasRandomText = /^[a-z]{4,}$/.test(trimmedContent.replace(/\s+/g, '')) && 
                         !/\b(good|bad|nice|cool|great|love|like|hate|help|work|yes|no|maybe)\b/.test(trimmedContent);
    
    if (hasRandomText) {
      return { isSpam: true, reason: 'Random or nonsensical text detected' };
    }
    
    // Check for very short or vague replies
    const vaguePhrases = [
      'ok', 'good', 'nice', 'cool', 'great', 'bad', 'awesome', 'lol', 'yes', 'no',
      'maybe', 'sure', 'fine', 'whatever', 'idk', 'dunno', 'k', 'yep', 'nah'
    ];
    
    if (trimmedContent.length < 5 || vaguePhrases.includes(trimmedContent)) {
      return { isSpam: true, reason: 'Very short or vague reply with no actionable value' };
    }
    
    // Check for repetitive patterns
    const words = trimmedContent.split(/\s+/);
    if (words.length > 3) {
      const uniqueWords = new Set(words);
      if (uniqueWords.size < words.length * 0.5) {
        return { isSpam: true, reason: 'Repetitive or copy-pasted content' };
      }
    }
    
    // Check for meaningless character repetition
    if (/(.)\1{4,}/.test(trimmedContent)) {
      return { isSpam: true, reason: 'Repetitive character patterns detected' };
    }
    
    return { isSpam: false, reason: 'Content appears to be valid feedback' };
  }
  
  private static getStrikeMessage(strikeLevel: number): string {
    switch (strikeLevel) {
      case 1:
        return '⚠️ Your post has been removed due to suspected spam. Please ensure feedback is specific & relevant, as agreed in our terms of service.';
      case 2:
        return '⚠️ This is your second spam warning. Continued misuse may lead to account suspension.';
      case 3:
        return '🚫 Your account has been suspended for repeated spam. Contact support if you believe this is an error.';
      default:
        return 'Content flagged for review.';
    }
  }
  
  static moderate(content: string, userStrikeCount: number = 0): ModerationResult {
    const { isSpam, reason } = this.isSpam(content);
    
    if (!isSpam) {
      return {
        classification: 'valid',
        reason,
        action: 'keep',
        strike_level: userStrikeCount,
        user_message: 'Thank you for your feedback!'
      };
    }
    
    // Determine the new strike level
    const newStrikeLevel = userStrikeCount + 1;
    const action = newStrikeLevel >= 3 ? 'suspend' : 'remove';
    
    return {
      classification: 'spam',
      reason,
      action,
      strike_level: newStrikeLevel,
      user_message: this.getStrikeMessage(newStrikeLevel)
    };
  }
}