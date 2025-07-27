import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Navbar } from '@/components/dashboard/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Globe, 
  MousePointer, 
  Clock,
  DollarSign,
  Eye,
  Zap,
  Calendar,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type Mode = 'preview' | 'dev' | 'build' | 'production';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  deployments: number;
  aiEditsUsed: number;
  earnings: number;
  growthRate: number;
}

interface ChartData {
  name: string;
  value: number;
  visitors?: number;
  deployments?: number;
}

export default function AnalyticsPage() {
  const [currentMode, setCurrentMode] = useState<Mode>('preview');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    pageViews: 0,
    uniqueVisitors: 0,
    deployments: 0,
    aiEditsUsed: 0,
    earnings: 0,
    growthRate: 0
  });
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for charts
  const trafficData: ChartData[] = [
    { name: 'Mon', value: 1200, visitors: 456 },
    { name: 'Tue', value: 1890, visitors: 567 },
    { name: 'Wed', value: 2390, visitors: 678 },
    { name: 'Thu', value: 3490, visitors: 789 },
    { name: 'Fri', value: 4000, visitors: 890 },
    { name: 'Sat', value: 3200, visitors: 712 },
    { name: 'Sun', value: 2800, visitors: 634 },
  ];

  const deploymentData: ChartData[] = [
    { name: 'Week 1', deployments: 12 },
    { name: 'Week 2', deployments: 18 },
    { name: 'Week 3', deployments: 24 },
    { name: 'Week 4', deployments: 31 },
  ];

  const projectData: ChartData[] = [
    { name: 'E-commerce', value: 45 },
    { name: 'Landing Pages', value: 30 },
    { name: 'Blogs', value: 15 },
    { name: 'Apps', value: 10 },
  ];

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?range=${timeRange}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Set mock data
      setAnalytics({
        pageViews: 15647,
        uniqueVisitors: 8234,
        deployments: 89,
        aiEditsUsed: 342,
        earnings: 1247.50,
        growthRate: 12.5
      });
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, description, change }: {
    title: string;
    value: string | number;
    icon: any;
    description: string;
    change?: number;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">{description}</p>
          {change !== undefined && (
            <Badge variant={change >= 0 ? 'default' : 'destructive'} className="text-xs">
              {change >= 0 ? '+' : ''}{change}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar currentMode={currentMode} onModeChange={setCurrentMode} />
        
        <div className="container py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Track your project performance, traffic, and growth metrics
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="traffic">Traffic</TabsTrigger>
              <TabsTrigger value="deployments">Deployments</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Page Views"
                  value={analytics.pageViews.toLocaleString()}
                  icon={Eye}
                  description="Total page views"
                  change={analytics.growthRate}
                />
                <StatCard
                  title="Unique Visitors"
                  value={analytics.uniqueVisitors.toLocaleString()}
                  icon={Users}
                  description="Unique visitors"
                  change={8.2}
                />
                <StatCard
                  title="Deployments"
                  value={analytics.deployments}
                  icon={Zap}
                  description="Successful deployments"
                  change={15.3}
                />
                <StatCard
                  title="AI Edits Used"
                  value={analytics.aiEditsUsed}
                  icon={MousePointer}
                  description="AI assistance requests"
                  change={22.1}
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Traffic Overview</CardTitle>
                    <CardDescription>Page views and visitors over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={trafficData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#8b5cf6" name="Page Views" />
                        <Line type="monotone" dataKey="visitors" stroke="#06b6d4" name="Visitors" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Project Types</CardTitle>
                    <CardDescription>Distribution of project categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={projectData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {projectData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="traffic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Total Sessions"
                  value="12,847"
                  icon={Users}
                  description="User sessions"
                  change={5.4}
                />
                <StatCard
                  title="Avg. Session Duration"
                  value="3m 42s"
                  icon={Clock}
                  description="Average time on site"
                  change={-2.1}
                />
                <StatCard
                  title="Bounce Rate"
                  value="34.2%"
                  icon={TrendingUp}
                  description="Single page sessions"
                  change={-1.8}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Daily Traffic</CardTitle>
                  <CardDescription>Page views and unique visitors by day</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={trafficData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8b5cf6" name="Page Views" />
                      <Bar dataKey="visitors" fill="#06b6d4" name="Unique Visitors" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deployments" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Total Deployments"
                  value={analytics.deployments}
                  icon={Zap}
                  description="All-time deployments"
                  change={18.7}
                />
                <StatCard
                  title="Success Rate"
                  value="94.2%"
                  icon={TrendingUp}
                  description="Successful deployments"
                  change={2.3}
                />
                <StatCard
                  title="Avg. Build Time"
                  value="2m 14s"
                  icon={Clock}
                  description="Average deployment time"
                  change={-8.5}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Deployment Activity</CardTitle>
                  <CardDescription>Weekly deployment statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={deploymentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="deployments" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="earnings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Total Earnings"
                  value={`$${analytics.earnings.toFixed(2)}`}
                  icon={DollarSign}
                  description="Total affiliate earnings"
                  change={25.3}
                />
                <StatCard
                  title="This Month"
                  value="$342.50"
                  icon={Calendar}
                  description="Current month earnings"
                  change={12.8}
                />
                <StatCard
                  title="Referrals"
                  value="47"
                  icon={Users}
                  description="Active referrals"
                  change={8.9}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Earnings Overview</CardTitle>
                  <CardDescription>Monthly earnings and referral performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <DollarSign className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">Affiliate Program</h3>
                    <p className="text-muted-foreground mb-4">
                      Start earning by referring new users to CodeFlow AI
                    </p>
                    <Button>View Referral Dashboard</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
