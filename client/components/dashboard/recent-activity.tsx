import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, 
  GitCommit,
  Rocket,
  Bot, 
  Globe,
  FileText,
  Share2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'deployment' | 'ai_edit' | 'github_sync' | 'domain_added' | 'blog_post' | 'social_post';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: any;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      // Simulate API call
      const mockActivities: Activity[] = [
        {
          id: '1',
          type: 'deployment',
          title: 'Project deployed successfully',
          description: 'my-awesome-app deployed to production',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        },
        {
          id: '2',
          type: 'ai_edit',
          title: 'AI code generation',
          description: 'Generated React component with TypeScript',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        },
        {
          id: '3',
          type: 'github_sync',
          title: 'GitHub repository synced',
          description: 'Pulled latest changes from main branch',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        },
        {
          id: '4',
          type: 'domain_added',
          title: 'Custom domain verified',
          description: 'myapp.clean8.online is now live',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        },
        {
          id: '5',
          type: 'blog_post',
          title: 'Blog post published',
          description: 'How to Build Better APIs',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        },
        {
          id: '6',
          type: 'social_post',
          title: 'Social media post scheduled',
          description: 'Twitter post about new features',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        }
      ];

      setActivities(mockActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'deployment': return <Rocket className="h-4 w-4" />;
      case 'ai_edit': return <Bot className="h-4 w-4" />;
      case 'github_sync': return <GitCommit className="h-4 w-4" />;
      case 'domain_added': return <Globe className="h-4 w-4" />;
      case 'blog_post': return <FileText className="h-4 w-4" />;
      case 'social_post': return <Share2 className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'deployment': return 'bg-green-500';
      case 'ai_edit': return 'bg-brand-500';
      case 'github_sync': return 'bg-gray-500';
      case 'domain_added': return 'bg-blue-500';
      case 'blog_post': return 'bg-purple-500';
      case 'social_post': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Your latest actions and updates across all projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3 items-start">
                <div className={`p-2 rounded-full ${getActivityColor(activity.type)} text-white`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <Badge variant="secondary" className="text-xs">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
