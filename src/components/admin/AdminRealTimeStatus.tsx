import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface AdminRealTimeStatusProps {
  isConnected: boolean;
  lastUpdate?: Date;
}

export const AdminRealTimeStatus: React.FC<AdminRealTimeStatusProps> = ({
  isConnected,
  lastUpdate
}) => {
  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={isConnected ? "default" : "secondary"} 
        className={`flex items-center gap-1 ${
          isConnected 
            ? "bg-success/10 text-success hover:bg-success/20" 
            : "bg-muted text-muted-foreground"
        }`}
      >
        {isConnected ? (
          <>
            <Wifi className="h-3 w-3" />
            Live Data
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3" />
            Offline
          </>
        )}
      </Badge>
      
      {lastUpdate && (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <RefreshCw className="h-3 w-3" />
          {lastUpdate.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};