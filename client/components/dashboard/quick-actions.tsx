import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Github, 
  Bot, 
  Globe, 
  BarChart3, 
  CreditCard, 
  Share2,
  FileText,
  Video
} from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      title: 'Import from GitHub',
      description: 'Connect and import your existing repositories',
      icon: Github,
      action: () => window.open('/dashboard/github', '_blank'),
      color: 'hover:bg-gray-50'
    },
    {
      title: 'Ask Josey AI',
      description: 'Get help with coding and project planning',
      icon: Bot,
      action: () => document.querySelector('[data-ai-chat]')?.scrollIntoView(),
      color: 'hover:bg-brand-50'
    },
    {
      title: 'Manage Domains',
      description: 'Set up custom domains for your projects',
      icon: Globe,
      action: () => window.open('/dashboard/domains', '_blank'),
      color: 'hover:bg-blue-50'
    },
    {
      title: 'View Analytics',
      description: 'Track your project performance and usage',
      icon: BarChart3,
      action: () => window.open('/dashboard/analytics', '_blank'),
      color: 'hover:bg-green-50'
    },
    {
      title: 'Upgrade Plan',
      description: 'Get unlimited AI edits and premium features',
      icon: CreditCard,
      action: () => window.open('/dashboard/billing', '_blank'),
      color: 'hover:bg-yellow-50'
    },
    {
      title: 'Social Media',
      description: 'Manage and schedule your social content',
      icon: Share2,
      action: () => window.open('/dashboard/social', '_blank'),
      color: 'hover:bg-purple-50'
    },
    {
      title: 'Blog Management',
      description: 'Create and publish blog posts with AI',
      icon: FileText,
      action: () => window.open('/dashboard/blog', '_blank'),
      color: 'hover:bg-indigo-50'
    },
    {
      title: 'Video Ads',
      description: 'Create automated video content for marketing',
      icon: Video,
      action: () => window.open('/dashboard/video-ads', '_blank'),
      color: 'hover:bg-pink-50'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks to help you get started quickly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant="ghost"
                onClick={action.action}
                className={`h-auto p-4 flex flex-col items-center text-center gap-2 ${action.color}`}
              >
                <Icon className="h-6 w-6" />
                <div>
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {action.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
