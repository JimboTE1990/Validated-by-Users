import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface AdminSecurityOptions {
  enableSessionTracking?: boolean;
  sessionTimeout?: number; // minutes
}

export const useAdminSecurity = (options: AdminSecurityOptions = {}) => {
  const { user } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());

  // Log admin activity
  const logActivity = useCallback(async (
    action: string,
    resourceType?: string,
    resourceId?: string,
    details?: any
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase.functions.invoke('verify-admin', {
        body: {
          action,
          resourceType,
          resourceId,
          details
        }
      });

      if (error) {
        console.error('Failed to log admin activity:', error);
      }
    } catch (error) {
      console.error('Error logging admin activity:', error);
    }
  }, [user]);

  // Verify admin access with server-side validation
  const verifyAdminAccess = useCallback(async (
    sessionToken?: string
  ): Promise<boolean> => {
    if (!user) return false;

    setIsVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-admin', {
        body: { 
          sessionToken,
          action: 'admin_access_verification'
        }
      });

      if (error || !data?.isValid) {
        toast({
          title: "Access Denied",
          description: "Your admin session has expired or is invalid.",
          variant: "destructive"
        });
        return false;
      }

      setLastActivity(new Date());
      return true;
    } catch (error) {
      console.error('Admin verification error:', error);
      toast({
        title: "Security Error",
        description: "Failed to verify admin access. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [user]);

  // Check if session should timeout
  const checkSessionTimeout = useCallback(() => {
    const timeoutMinutes = options.sessionTimeout || 120; // 2 hours default
    const now = new Date();
    const timeDiff = (now.getTime() - lastActivity.getTime()) / (1000 * 60);
    
    if (timeDiff > timeoutMinutes) {
      toast({
        title: "Session Expired",
        description: "Your admin session has timed out for security.",
        variant: "destructive"
      });
      return true;
    }
    return false;
  }, [lastActivity, options.sessionTimeout]);

  // Update activity timestamp
  const updateActivity = useCallback(() => {
    setLastActivity(new Date());
  }, []);

  // Enhanced admin action wrapper with logging and verification
  const executeAdminAction = useCallback(async <T>(
    action: string,
    operation: () => Promise<T>,
    resourceType?: string,
    resourceId?: string,
    details?: any
  ): Promise<T | null> => {
    // Check session timeout first
    if (options.enableSessionTracking && checkSessionTimeout()) {
      throw new Error('Session expired');
    }

    // Verify admin access
    const isValid = await verifyAdminAccess();
    if (!isValid) {
      throw new Error('Admin access denied');
    }

    try {
      // Execute the operation
      const result = await operation();
      
      // Log successful action
      await logActivity(action, resourceType, resourceId, {
        ...details,
        success: true,
        timestamp: new Date().toISOString()
      });

      updateActivity();
      return result;
    } catch (error) {
      // Log failed action
      await logActivity(action, resourceType, resourceId, {
        ...details,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });

      console.error(`Admin action '${action}' failed:`, error);
      throw error;
    }
  }, [verifyAdminAccess, logActivity, updateActivity, checkSessionTimeout, options]);

  return {
    logActivity,
    verifyAdminAccess,
    executeAdminAction,
    updateActivity,
    checkSessionTimeout,
    isVerifying,
    lastActivity
  };
};