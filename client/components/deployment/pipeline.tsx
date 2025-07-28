import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowRight,
  Eye,
  Hammer,
  Rocket,
  GitBranch,
  Globe,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeploymentStage {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  duration?: number;
  logs?: string[];
  startTime?: Date;
  endTime?: Date;
}

interface Deployment {
  id: string;
  projectId: string;
  environment: 'preview' | 'staging' | 'production';
  status: 'pending' | 'running' | 'success' | 'failed' | 'cancelled';
  stages: DeploymentStage[];
  createdAt: Date;
  completedAt?: Date;
  deploymentUrl?: string;
  gitCommit?: string;
  branch?: string;
}

const deploymentStages: Omit<DeploymentStage, 'id' | 'status'>[] = [
  {
    name: 'Source Preparation',
    description: 'Preparing source code and dependencies'
  },
  {
    name: 'Build Process',
    description: 'Compiling and optimizing your application'
  },
  {
    name: 'Testing',
    description: 'Running automated tests and quality checks'
  },
  {
    name: 'Asset Optimization',
    description: 'Optimizing images, CSS, and JavaScript'
  },
  {
    name: 'Deployment',
    description: 'Deploying to target environment'
  },
  {
    name: 'Health Check',
    description: 'Verifying deployment health and availability'
  }
];

interface DeploymentPipelineProps {
  projectId: string;
  onDeploy?: (environment: 'preview' | 'staging' | 'production') => void;
}

const StageIcon: React.FC<{ status: DeploymentStage['status'] }> = ({ status }) => {
  switch (status) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'failed':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'running':
      return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
    case 'pending':
      return <Clock className="h-5 w-5 text-gray-400" />;
    case 'skipped':
      return <ArrowRight className="h-5 w-5 text-gray-400" />;
    default:
      return <Clock className="h-5 w-5 text-gray-400" />;
  }
};

const DeploymentCard: React.FC<{ 
  deployment: Deployment; 
  onViewLogs: (deploymentId: string) => void;
  onRetry: (deploymentId: string) => void;
}> = ({ deployment, onViewLogs, onRetry }) => {
  const getStatusColor = (status: Deployment['status']) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'running': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getEnvironmentIcon = (env: string) => {
    switch (env) {
      case 'preview': return <Eye className="h-4 w-4" />;
      case 'staging': return <Hammer className="h-4 w-4" />;
      case 'production': return <Rocket className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getEnvironmentIcon(deployment.environment)}
            <div>
              <CardTitle className="text-lg capitalize">
                {deployment.environment} Deployment
              </CardTitle>
              <CardDescription>
                {deployment.gitCommit && (
                  <span className="inline-flex items-center gap-1">
                    <GitBranch className="h-3 w-3" />
                    {deployment.branch} • {deployment.gitCommit.substring(0, 7)}
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(deployment.status)} text-white`}>
              {deployment.status}
            </Badge>
            {deployment.deploymentUrl && deployment.status === 'success' && (
              <Button variant="outline" size="sm" asChild>
                <a href={deployment.deploymentUrl} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-1" />
                  View
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {deployment.stages.map((stage, index) => (
            <div key={stage.id} className="flex items-center gap-3">
              <StageIcon status={stage.status} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{stage.name}</span>
                  {stage.duration && (
                    <span className="text-xs text-muted-foreground">
                      {stage.duration}s
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{stage.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-muted-foreground">
            Started {deployment.createdAt.toLocaleTimeString()}
            {deployment.completedAt && (
              <span> • Completed {deployment.completedAt.toLocaleTimeString()}</span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onViewLogs(deployment.id)}>
              <Terminal className="h-4 w-4 mr-1" />
              Logs
            </Button>
            {deployment.status === 'failed' && (
              <Button variant="outline" size="sm" onClick={() => onRetry(deployment.id)}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const DeploymentPipeline: React.FC<DeploymentPipelineProps> = ({ 
  projectId, 
  onDeploy 
}) => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('deployments');
  const [selectedLogs, setSelectedLogs] = useState<string | null>(null);

  useEffect(() => {
    fetchDeployments();
  }, [projectId]);

  const fetchDeployments = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/deployments`);
      const data = await response.json();
      setDeployments(data);
    } catch (error) {
      console.error('Error fetching deployments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeploy = async (environment: 'preview' | 'staging' | 'production') => {
    try {
      const response = await fetch(`/api/projects/${projectId}/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ environment })
      });
      
      if (response.ok) {
        fetchDeployments();
        onDeploy?.(environment);
      }
    } catch (error) {
      console.error('Error triggering deployment:', error);
    }
  };

  const handleViewLogs = (deploymentId: string) => {
    setSelectedLogs(deploymentId);
    setActiveTab('logs');
  };

  const handleRetry = async (deploymentId: string) => {
    try {
      await fetch(`/api/deployments/${deploymentId}/retry`, { method: 'POST' });
      fetchDeployments();
    } catch (error) {
      console.error('Error retrying deployment:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Deploy Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Deploy Your Project</CardTitle>
          <CardDescription>
            Choose your deployment environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleDeploy('preview')}
            >
              <Eye className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Preview</div>
                <div className="text-xs text-muted-foreground">Quick preview deployment</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleDeploy('staging')}
            >
              <Hammer className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Staging</div>
                <div className="text-xs text-muted-foreground">Test before production</div>
              </div>
            </Button>
            
            <Button 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleDeploy('production')}
            >
              <Rocket className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Production</div>
                <div className="text-xs text-muted-foreground">Live deployment</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deployment History */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment History</CardTitle>
          <CardDescription>
            Track your deployment status and history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="deployments">Deployments</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="deployments" className="space-y-4 mt-6">
              {deployments.length === 0 ? (
                <div className="text-center py-8">
                  <Rocket className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-medium mb-2">No deployments yet</h3>
                  <p className="text-muted-foreground">
                    Deploy your project to see deployment history here
                  </p>
                </div>
              ) : (
                deployments.map((deployment) => (
                  <DeploymentCard
                    key={deployment.id}
                    deployment={deployment}
                    onViewLogs={handleViewLogs}
                    onRetry={handleRetry}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="logs" className="mt-6">
              {selectedLogs ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="h-5 w-5" />
                      Deployment Logs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] w-full border rounded-md p-4 bg-black text-green-400 font-mono text-sm">
                      <div className="space-y-1">
                        {/* Mock logs - replace with actual log data */}
                        <div>[2024-01-15 10:30:15] Starting deployment process...</div>
                        <div>[2024-01-15 10:30:16] Downloading source code...</div>
                        <div>[2024-01-15 10:30:18] Installing dependencies...</div>
                        <div>[2024-01-15 10:30:45] Building application...</div>
                        <div>[2024-01-15 10:31:23] Running tests...</div>
                        <div>[2024-01-15 10:31:30] ✓ All tests passed</div>
                        <div>[2024-01-15 10:31:31] Optimizing assets...</div>
                        <div>[2024-01-15 10:31:45] Deploying to production...</div>
                        <div>[2024-01-15 10:32:00] ✓ Deployment successful</div>
                        <div>[2024-01-15 10:32:05] Health check passed</div>
                        <div>[2024-01-15 10:32:06] 🚀 Your application is live!</div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-8">
                  <Terminal className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-medium mb-2">Select a deployment</h3>
                  <p className="text-muted-foreground">
                    Choose a deployment from the list to view its logs
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
