import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Rocket, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink,
  Eye,
  Settings,
  RefreshCw
} from 'lucide-react';

interface DeploymentStatusProps {
  status: 'idle' | 'building' | 'deployed' | 'error';
  deploymentUrl?: string;
  onDeploy: () => void;
}

export function DeploymentStatus({ status, deploymentUrl, onDeploy }: DeploymentStatusProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'deployed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'building': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'deployed': return 'Deployed';
      case 'building': return 'Building...';
      case 'error': return 'Failed';
      default: return 'Not Deployed';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'deployed': return 'bg-green-500';
      case 'building': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (status === 'idle') {
    return (
      <Button onClick={onDeploy} variant="outline" className="gap-2">
        <Rocket className="h-4 w-4" />
        Deploy
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          {getStatusIcon()}
          <span>{getStatusText()}</span>
          <Badge className={`${getStatusColor()} text-white ml-1`}>
            CI/CD
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Deployment</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {deploymentUrl && (
          <DropdownMenuItem asChild>
            <a href={deploymentUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Live Site
            </a>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={onDeploy}>
          <Rocket className="mr-2 h-4 w-4" />
          Redeploy
        </DropdownMenuItem>
        
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Deployment Settings
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          View Build Logs
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
