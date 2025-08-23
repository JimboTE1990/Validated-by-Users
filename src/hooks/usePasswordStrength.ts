import { useMemo } from 'react';

export interface PasswordStrength {
  score: number; // 0-100
  level: 'low' | 'medium' | 'high';
  feedback: string[];
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    special: boolean;
    noPersonalData: boolean;
    noCommonPatterns: boolean;
  };
}

interface UsePasswordStrengthProps {
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

const commonPatterns = [
  /123+/, /abc+/, /qwerty/i, /password/i, /admin/i, /letmein/i,
  /welcome/i, /monkey/i, /dragon/i, /master/i, /login/i, /pass/i
];

const sequentialPatterns = [
  /012+/, /123+/, /234+/, /345+/, /456+/, /567+/, /678+/, /789+/, /890+/,
  /abc+/i, /bcd+/i, /cde+/i, /def+/i, /efg+/i, /fgh+/i, /ghi+/i, /hij+/i, /ijk+/i, /jkl+/i, /klm+/i, /lmn+/i, /mno+/i, /nop+/i, /opq+/i, /pqr+/i, /qrs+/i, /rst+/i, /stu+/i, /tuv+/i, /uvw+/i, /vwx+/i, /wxy+/i, /xyz+/i
];

const repetitivePatterns = [
  /(.)\1{2,}/, // Same character 3+ times
  /(.{2,})\1{1,}/ // Pattern repeated 2+ times
];

export const usePasswordStrength = ({ 
  password, 
  email, 
  firstName, 
  lastName 
}: UsePasswordStrengthProps): PasswordStrength => {
  return useMemo(() => {
    if (!password) {
      return {
        score: 0,
        level: 'low',
        feedback: [],
        checks: {
          length: false,
          uppercase: false,
          lowercase: false,
          numbers: false,
          special: false,
          noPersonalData: true,
          noCommonPatterns: true,
        }
      };
    }

    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password),
      noPersonalData: true,
      noCommonPatterns: true,
    };

    // Check for personal data in password
    const lowerPassword = password.toLowerCase();
    if (email) {
      const emailPrefix = email.split('@')[0].toLowerCase();
      if (emailPrefix.length > 2 && lowerPassword.includes(emailPrefix)) {
        checks.noPersonalData = false;
      }
    }
    if (firstName && firstName.length > 2 && lowerPassword.includes(firstName.toLowerCase())) {
      checks.noPersonalData = false;
    }
    if (lastName && lastName.length > 2 && lowerPassword.includes(lastName.toLowerCase())) {
      checks.noPersonalData = false;
    }

    // Check for common patterns
    const hasCommonPattern = commonPatterns.some(pattern => pattern.test(password));
    const hasSequentialPattern = sequentialPatterns.some(pattern => pattern.test(password));
    const hasRepetitivePattern = repetitivePatterns.some(pattern => pattern.test(password));
    
    if (hasCommonPattern || hasSequentialPattern || hasRepetitivePattern) {
      checks.noCommonPatterns = false;
    }

    // Calculate score
    let score = 0;
    
    // Length scoring (0-30 points)
    if (password.length >= 12) score += 30;
    else if (password.length >= 8) score += 20;
    else if (password.length >= 6) score += 10;

    // Character variety (0-40 points)
    if (checks.lowercase) score += 8;
    if (checks.uppercase) score += 8;
    if (checks.numbers) score += 8;
    if (checks.special) score += 16;

    // Security checks (0-30 points)
    if (checks.noPersonalData) score += 15;
    if (checks.noCommonPatterns) score += 15;

    // Determine level
    let level: 'low' | 'medium' | 'high' = 'low';
    if (score >= 70) level = 'high';
    else if (score >= 40) level = 'medium';

    // Generate feedback
    const feedback: string[] = [];
    
    if (!checks.length) {
      feedback.push("Use at least 8 characters (12+ recommended)");
    } else if (password.length < 12) {
      feedback.push("Consider using 12+ characters for better security");
    }
    
    if (!checks.uppercase) feedback.push("Add uppercase letters (A-Z)");
    if (!checks.lowercase) feedback.push("Add lowercase letters (a-z)");
    if (!checks.numbers) feedback.push("Include numbers (0-9)");
    if (!checks.special) feedback.push("Add special characters (!@#$%^&*)");
    
    if (!checks.noPersonalData) {
      feedback.push("Avoid using your name or email in your password");
    }
    
    if (!checks.noCommonPatterns) {
      feedback.push("Avoid common patterns like '123', 'abc', or repeated characters");
    }

    // Positive feedback for strong passwords
    if (level === 'high') {
      feedback.push("Excellent! Your password is very secure");
    } else if (level === 'medium') {
      feedback.push("Good password strength - consider the suggestions above");
    }

    return {
      score: Math.min(score, 100),
      level,
      feedback,
      checks,
    };
  }, [password, email, firstName, lastName]);
};