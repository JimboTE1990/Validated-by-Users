import { useEffect, useState } from 'react';

// Simplified admin updates hook that refreshes data periodically
export const useAdminRealTimeUpdates = (onStatsUpdate?: () => void) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!onStatsUpdate) return;

    // Set as "connected" immediately for UI purposes
    setIsConnected(true);

    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      onStatsUpdate();
    }, 30000);

    // Initial update
    onStatsUpdate();

    return () => {
      clearInterval(interval);
    };
  }, [onStatsUpdate]);

  const disconnect = () => {
    setIsConnected(false);
  };

  return {
    isConnected,
    disconnect
  };
};