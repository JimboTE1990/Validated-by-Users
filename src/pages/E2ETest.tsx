import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { E2ETestFlow, E2ETestResult } from '@/utils/e2e-test-flow';
import Header from '@/components/Header';

const E2ETest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<E2ETestResult[]>([]);
  const [currentStep, setCurrentStep] = useState('');
  const [successRate, setSuccessRate] = useState(0);

  const runE2ETest = async () => {
    setIsRunning(true);
    setResults([]);
    setCurrentStep('Starting E2E Test...');
    
    const testFlow = new E2ETestFlow();
    
    try {
      const testResults = await testFlow.runFullE2ETest();
      setResults(testResults);
      setSuccessRate(testFlow.getSuccessRate());
      testFlow.printSummary();
    } catch (error) {
      console.error('E2E Test failed:', error);
    } finally {
      setIsRunning(false);
      setCurrentStep('');
    }
  };

  const getStepIcon = (success: boolean) => {
    return success ? '✅' : '❌';
  };

  const getStepColor = (success: boolean) => {
    return success ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300';
  };

  const progress = results.length > 0 ? (results.length / 15) * 100 : 0; // Assuming ~15 total steps

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">E2E Test Flow</CardTitle>
              <CardDescription>
                Complete end-to-end testing of the platform: Developer posts → Users provide feedback → Winners selected → Payouts processed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button 
                  onClick={runE2ETest} 
                  disabled={isRunning}
                  size="lg"
                  className="min-w-[200px]"
                >
                  {isRunning ? 'Running Test...' : 'Start E2E Test'}
                </Button>
                
                {results.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant={successRate === 100 ? 'default' : successRate > 75 ? 'secondary' : 'destructive'}>
                      Success Rate: {successRate.toFixed(1)}%
                    </Badge>
                  </div>
                )}
              </div>
              
              {isRunning && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground">{currentStep}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Flow Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Test Flow Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg border">
                  <div className="text-2xl mb-2">👨‍💻</div>
                  <h3 className="font-semibold">Step 1-3</h3>
                  <p className="text-sm text-muted-foreground">Developer creates account and posts product</p>
                </div>
                <div className="text-center p-4 rounded-lg border">
                  <div className="text-2xl mb-2">💬</div>
                  <h3 className="font-semibold">Step 4</h3>
                  <p className="text-sm text-muted-foreground">Users provide feedback and comments</p>
                </div>
                <div className="text-center p-4 rounded-lg border">
                  <div className="text-2xl mb-2">🏆</div>
                  <h3 className="font-semibold">Step 5-6</h3>
                  <p className="text-sm text-muted-foreground">Contest ends and winners selected</p>
                </div>
                <div className="text-center p-4 rounded-lg border">
                  <div className="text-2xl mb-2">💰</div>
                  <h3 className="font-semibold">Step 7</h3>
                  <p className="text-sm text-muted-foreground">Payouts processed to winners</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
                <CardDescription>
                  Detailed results from the E2E test execution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full">
                  <div className="space-y-2">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${getStepColor(result.success)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>{getStepIcon(result.success)}</span>
                            <span className="font-medium">{result.step}</span>
                          </div>
                          <Badge variant={result.success ? 'default' : 'destructive'}>
                            {result.success ? 'Success' : 'Failed'}
                          </Badge>
                        </div>
                        <p className="text-sm mt-1">{result.message}</p>
                        {result.error && (
                          <p className="text-xs text-red-600 mt-1">Error: {result.error}</p>
                        )}
                        {result.data && (
                          <details className="text-xs mt-2">
                            <summary className="cursor-pointer text-muted-foreground">
                              View Data
                            </summary>
                            <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Test Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>• <strong>Authentication:</strong> Test users must be able to sign up and log in</p>
                <p>• <strong>Post Creation:</strong> Developer can create a product validation post with prize pool</p>
                <p>• <strong>User Feedback:</strong> Multiple users can comment and provide feedback</p>
                <p>• <strong>Winner Selection:</strong> System can select winners based on feedback quality</p>
                <p>• <strong>Payout Processing:</strong> Winners receive their prize money (simulated)</p>
                <p>• <strong>Edge Functions:</strong> select-winners and process-payouts functions work correctly</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default E2ETest;