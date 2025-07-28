import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Navbar } from '@/components/dashboard/navbar';
import { ProjectGrid } from '@/components/dashboard/project-grid';
import { AIChatBox } from '@/components/dashboard/ai-chat-box';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentActivity } from '@/components/dashboard/recent-activity';

type Mode = 'preview' | 'dev' | 'build' | 'production';

export default function Dashboard() {
  const [currentMode, setCurrentMode] = useState<Mode>('preview');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar currentMode={currentMode} onModeChange={setCurrentMode} />
        
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
                <p className="text-muted-foreground">
                  Manage your projects and deploy with AI assistance
                </p>
              </div>

              <QuickActions />
              <ProjectGrid currentMode={currentMode} />
              <RecentActivity />
            </div>

            <div className="space-y-8">
              <AIChatBox />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
