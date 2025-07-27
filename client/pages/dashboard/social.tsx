import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Navbar } from '@/components/dashboard/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Calendar,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Bot,
  Send,
  Eye,
  BarChart3,
  Plus,
  Sparkles,
  Image,
  Video,
  Settings,
  TrendingUp
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

type Mode = 'preview' | 'dev' | 'build' | 'production';
type Platform = 'facebook' | 'instagram' | 'twitter';

interface SocialPost {
  id: string;
  platform: Platform;
  content: string;
  scheduledAt?: Date;
  postedAt?: Date;
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  mediaUrl?: string;
  analytics?: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
}

export default function SocialMediaPage() {
  const [currentMode, setCurrentMode] = useState<Mode>('preview');
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newPost, setNewPost] = useState({
    platform: 'twitter' as Platform,
    content: '',
    scheduledAt: '',
    mediaUrl: ''
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/social/posts');
      const data = await response.json();
      setPosts(data || mockPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts(mockPosts);
    }
  };

  const generateContent = async (prompt: string, platform: Platform) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-social-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, platform })
      });
      
      const data = await response.json();
      setNewPost(prev => ({ ...prev, content: data.content }));
      
      toast({
        title: "Content generated!",
        description: "Josey AI has created your social media post."
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const schedulePost = async () => {
    try {
      const response = await fetch('/api/social/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });

      if (response.ok) {
        setShowCreateDialog(false);
        setNewPost({ platform: 'twitter', content: '', scheduledAt: '', mediaUrl: '' });
        fetchPosts();
        toast({
          title: "Post scheduled!",
          description: "Your social media post has been scheduled successfully."
        });
      }
    } catch (error) {
      console.error('Error scheduling post:', error);
    }
  };

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'facebook': return <Facebook className="h-4 w-4" />;
      case 'instagram': return <Instagram className="h-4 w-4" />;
      case 'twitter': return <Twitter className="h-4 w-4" />;
      default: return <Twitter className="h-4 w-4" />;
    }
  };

  const getPlatformColor = (platform: Platform) => {
    switch (platform) {
      case 'facebook': return 'bg-blue-500';
      case 'instagram': return 'bg-pink-500';
      case 'twitter': return 'bg-cyan-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Mock data
  const mockPosts: SocialPost[] = [
    {
      id: '1',
      platform: 'twitter',
      content: '🚀 Just deployed my latest project with CodeFlow AI! The visual editor + AI assistance made development so much faster. #CodeFlowAI #WebDev',
      scheduledAt: new Date(Date.now() + 3600000),
      status: 'scheduled',
      analytics: { views: 0, likes: 0, shares: 0, comments: 0 }
    },
    {
      id: '2',
      platform: 'facebook',
      content: 'Excited to share our new landing page built with CodeFlow AI! The drag-and-drop editor made it incredibly easy to create a professional site.',
      postedAt: new Date(Date.now() - 86400000),
      status: 'posted',
      analytics: { views: 1247, likes: 89, shares: 23, comments: 12 }
    },
    {
      id: '3',
      platform: 'instagram',
      content: 'Building the future with AI-powered development tools ✨ #TechLife #CodeFlowAI',
      scheduledAt: new Date(Date.now() + 7200000),
      status: 'scheduled',
      mediaUrl: 'https://via.placeholder.com/400x400',
      analytics: { views: 0, likes: 0, shares: 0, comments: 0 }
    }
  ];

  const aiPrompts = [
    "Write about the benefits of AI-assisted coding",
    "Create a post about launching a new web project",
    "Share tips for modern web development",
    "Announce a new feature or update",
    "Write about productivity in software development"
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar currentMode={currentMode} onModeChange={setCurrentMode} />
        
        <div className="container py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Social Media Management</h1>
              <p className="text-muted-foreground">
                Create, schedule, and manage your social media presence with Josey AI
              </p>
            </div>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Create Social Media Post
                  </DialogTitle>
                  <DialogDescription>
                    Use Josey AI to generate engaging content for your social platforms
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div>
                    <Label>Platform</Label>
                    <div className="flex gap-2 mt-2">
                      {(['twitter', 'facebook', 'instagram'] as Platform[]).map((platform) => (
                        <Button
                          key={platform}
                          variant={newPost.platform === platform ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewPost(prev => ({ ...prev, platform }))}
                          className="gap-2"
                        >
                          {getPlatformIcon(platform)}
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>AI Content Generation</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {aiPrompts.map((prompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => generateContent(prompt, newPost.platform)}
                          disabled={isGenerating}
                          className="justify-start text-left h-auto p-3"
                        >
                          <Bot className="h-4 w-4 mr-2 flex-shrink-0" />
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Write your post content or use AI generation above..."
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                      className="min-h-[120px] mt-2"
                      disabled={isGenerating}
                    />
                    {isGenerating && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Bot className="h-4 w-4 animate-pulse" />
                        Josey AI is generating content...
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="scheduledAt">Schedule For</Label>
                      <Input
                        id="scheduledAt"
                        type="datetime-local"
                        value={newPost.scheduledAt}
                        onChange={(e) => setNewPost(prev => ({ ...prev, scheduledAt: e.target.value }))}
                        className="mt-2"
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mediaUrl">Media URL (Optional)</Label>
                      <Input
                        id="mediaUrl"
                        placeholder="https://example.com/image.jpg"
                        value={newPost.mediaUrl}
                        onChange={(e) => setNewPost(prev => ({ ...prev, mediaUrl: e.target.value }))}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={schedulePost} disabled={!newPost.content} className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      {newPost.scheduledAt ? 'Schedule Post' : 'Post Now'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-6">
              {posts.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Sparkles className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first social media post with AI assistance
                    </p>
                    <Button onClick={() => setShowCreateDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Post
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {posts.map((post) => (
                    <Card key={post.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${getPlatformColor(post.platform)} text-white`}>
                              {getPlatformIcon(post.platform)}
                            </div>
                            <div>
                              <CardTitle className="text-lg capitalize">{post.platform}</CardTitle>
                              <CardDescription className="flex items-center gap-2">
                                <Badge className={`${getStatusColor(post.status)} text-white`}>
                                  {post.status}
                                </Badge>
                                {post.scheduledAt && (
                                  <span className="flex items-center gap-1 text-sm">
                                    <Clock className="h-3 w-3" />
                                    {post.scheduledAt.toLocaleDateString()} at {post.scheduledAt.toLocaleTimeString()}
                                  </span>
                                )}
                                {post.postedAt && (
                                  <span className="flex items-center gap-1 text-sm">
                                    <Calendar className="h-3 w-3" />
                                    Posted {post.postedAt.toLocaleDateString()}
                                  </span>
                                )}
                              </CardDescription>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="bg-muted rounded-lg p-4">
                          <p className="text-sm whitespace-pre-wrap">{post.content}</p>
                          {post.mediaUrl && (
                            <div className="mt-3">
                              <img 
                                src={post.mediaUrl} 
                                alt="Post media" 
                                className="max-w-xs rounded-lg"
                              />
                            </div>
                          )}
                        </div>

                        {post.status === 'posted' && post.analytics && (
                          <div className="grid grid-cols-4 gap-4 pt-2 border-t">
                            <div className="text-center">
                              <div className="text-lg font-bold">{post.analytics.views}</div>
                              <div className="text-xs text-muted-foreground">Views</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold">{post.analytics.likes}</div>
                              <div className="text-xs text-muted-foreground">Likes</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold">{post.analytics.shares}</div>
                              <div className="text-xs text-muted-foreground">Shares</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold">{post.analytics.comments}</div>
                              <div className="text-xs text-muted-foreground">Comments</div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Social Media Analytics
                  </CardTitle>
                  <CardDescription>
                    Track your social media performance across all platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                    <p className="text-muted-foreground">
                      Detailed analytics will appear here once you have posted content
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Social Media Connections</CardTitle>
                  <CardDescription>
                    Connect your social media accounts to enable posting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {['facebook', 'instagram', 'twitter'].map((platform) => (
                    <div key={platform} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getPlatformIcon(platform as Platform)}
                        <div>
                          <div className="font-medium capitalize">{platform}</div>
                          <div className="text-sm text-muted-foreground">Not connected</div>
                        </div>
                      </div>
                      <Button variant="outline">Connect</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
