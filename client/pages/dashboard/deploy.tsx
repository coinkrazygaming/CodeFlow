import { ProtectedRoute } from '@/components/auth/protected-route';
import { Navbar } from '@/components/dashboard/navbar';
import { DeploymentPipeline } from '@/components/deployment/pipeline';
import { useState } from 'react';

type Mode = 'preview' | 'dev' | 'build' | 'production';

export default function DeployPage() {
  const [currentMode, setCurrentMode] = useState<Mode>('production');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar currentMode={currentMode} onModeChange={setCurrentMode} />
        
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Deployments</h1>
            <p className="text-muted-foreground">
              Manage and monitor your project deployments across all environments
            </p>
          </div>

          <DeploymentPipeline 
            projectId="current-project" 
            onDeploy={(env) => console.log(`Deploying to ${env}`)}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
