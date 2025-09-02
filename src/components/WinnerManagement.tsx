import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, DollarSign, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useWinnerManagement } from '@/hooks/useWinnerManagement';

interface WinnerManagementProps {
  postId: string;
  endDate: string;
  contestCompleted: boolean;
  prizePool: number;
  onStatusChange?: () => void;
}

export const WinnerManagement = ({ 
  postId, 
  endDate, 
  contestCompleted, 
  prizePool,
  onStatusChange 
}: WinnerManagementProps) => {
  const { selectWinners, processPayouts, getWinners, loading } = useWinnerManagement();
  const [winners, setWinners] = useState<any[]>([]);
  const [winnersLoaded, setWinnersLoaded] = useState(false);

  const isExpired = new Date() >= new Date(endDate);
  const canSelectWinners = isExpired && !contestCompleted;
  const hasWinners = winners.length > 0;
  const hasPendingPayouts = winners.some(w => w.payout_status === 'pending');

  useEffect(() => {
    if (contestCompleted && !winnersLoaded) {
      loadWinners();
    }
  }, [contestCompleted, winnersLoaded]);

  const loadWinners = async () => {
    const winnerData = await getWinners(postId);
    setWinners(winnerData);
    setWinnersLoaded(true);
  };

  const handleSelectWinners = async () => {
    const result = await selectWinners(postId);
    if (result.success) {
      setWinners(result.winners || []);
      setWinnersLoaded(true);
      onStatusChange?.();
    }
  };

  const handleProcessPayouts = async () => {
    const result = await processPayouts(postId);
    if (result.success) {
      await loadWinners(); // Refresh winner data
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
      case 'processing':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Processing</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  if (!isExpired) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Contest Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Contest is still active. Winners will be selected after expiry.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Winner Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Action Buttons */}
        <div className="flex gap-3">
          {canSelectWinners && (
            <Button 
              onClick={handleSelectWinners}
              disabled={loading}
              className="flex-1"
            >
              <Users className="h-4 w-4 mr-2" />
              Select Winners
            </Button>
          )}
          
          {hasWinners && hasPendingPayouts && (
            <Button 
              onClick={handleProcessPayouts}
              disabled={loading}
              variant="secondary"
              className="flex-1"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Process Payouts
            </Button>
          )}
        </div>

        {/* Winners List */}
        {hasWinners && (
          <div className="space-y-4">
            <h4 className="font-semibold">Contest Winners</h4>
            <div className="space-y-3">
              {winners.map((winner, index) => (
                <div key={winner.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                        {winner.position}
                      </div>
                      <div>
                        <p className="font-medium">
                          {winner.profiles?.first_name || 'Anonymous'} {winner.profiles?.last_name || 'User'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Prize: £{winner.prize_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(winner.payout_status)}
                  </div>
                  
                  {winner.comments?.content && (
                    <div className="text-sm bg-muted/50 p-3 rounded border-l-2 border-primary/20">
                      <p className="text-muted-foreground">Winning comment:</p>
                      <p className="mt-1">{winner.comments.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Prize Pool:</span>
                  <p className="font-semibold">£{prizePool.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Winners:</span>
                  <p className="font-semibold">{winners.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {contestCompleted && !hasWinners && (
          <div className="text-center py-6 text-muted-foreground">
            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No eligible winners found for this contest.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};