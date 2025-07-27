import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Navbar } from '@/components/dashboard/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Copy,
  ExternalLink,
  Settings,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

type Mode = 'preview' | 'dev' | 'build' | 'production';

interface Domain {
  id: string;
  domain: string;
  project_id: string;
  project_name: string;
  verified: boolean;
  dns_records: {
    type: string;
    name: string;
    value: string;
    required: boolean;
  }[];
  ssl_status: 'pending' | 'active' | 'failed';
  created_at: string;
}

export default function DomainsPage() {
  const [currentMode, setCurrentMode] = useState<Mode>('preview');
  const [domains, setDomains] = useState<Domain[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newDomain, setNewDomain] = useState({
    domain: '',
    project_id: ''
  });

  useEffect(() => {
    fetchDomains();
    fetchProjects();
  }, []);

  const fetchDomains = async () => {
    try {
      const response = await fetch('/api/domains');
      const data = await response.json();
      setDomains(data);
    } catch (error) {
      console.error('Error fetching domains:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const addDomain = async () => {
    try {
      const response = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDomain)
      });

      if (response.ok) {
        setShowAddDialog(false);
        setNewDomain({ domain: '', project_id: '' });
        fetchDomains();
        toast({
          title: "Domain added",
          description: "Your domain has been added. Please configure the DNS records."
        });
      }
    } catch (error) {
      console.error('Error adding domain:', error);
    }
  };

  const deleteDomain = async (domainId: string) => {
    if (!confirm('Are you sure you want to delete this domain?')) return;

    try {
      await fetch(`/api/domains/${domainId}`, { method: 'DELETE' });
      fetchDomains();
      toast({
        title: "Domain deleted",
        description: "The domain has been removed from your account."
      });
    } catch (error) {
      console.error('Error deleting domain:', error);
    }
  };

  const verifyDomain = async (domainId: string) => {
    try {
      const response = await fetch(`/api/domains/${domainId}/verify`, { method: 'POST' });
      const data = await response.json();
      
      if (data.verified) {
        toast({
          title: "Domain verified",
          description: "Your domain is now active and ready to use."
        });
      } else {
        toast({
          title: "Verification failed",
          description: "Please check your DNS configuration and try again.",
          variant: "destructive"
        });
      }
      
      fetchDomains();
    } catch (error) {
      console.error('Error verifying domain:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "DNS record copied to clipboard."
    });
  };

  const getStatusIcon = (verified: boolean, sslStatus: string) => {
    if (verified && sslStatus === 'active') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (verified) {
      return <Clock className="h-5 w-5 text-yellow-500" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = (verified: boolean, sslStatus: string) => {
    if (verified && sslStatus === 'active') {
      return 'Active';
    } else if (verified) {
      return 'SSL Pending';
    } else {
      return 'Pending';
    }
  };

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
              <h1 className="text-3xl font-bold mb-2">Domain Management</h1>
              <p className="text-muted-foreground">
                Manage custom domains for your projects with clean8.online integration
              </p>
            </div>

            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Domain
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Custom Domain</DialogTitle>
                  <DialogDescription>
                    Connect a custom domain to one of your projects
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="domain">Domain Name</Label>
                    <Input
                      id="domain"
                      placeholder="example.com or subdomain.clean8.online"
                      value={newDomain.domain}
                      onChange={(e) => setNewDomain(prev => ({ ...prev, domain: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="project">Project</Label>
                    <select
                      id="project"
                      className="w-full p-2 border rounded-md"
                      value={newDomain.project_id}
                      onChange={(e) => setNewDomain(prev => ({ ...prev, project_id: e.target.value }))}
                    >
                      <option value="">Select a project</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button 
                    onClick={addDomain} 
                    className="w-full" 
                    disabled={!newDomain.domain || !newDomain.project_id}
                  >
                    Add Domain
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="domains" className="space-y-6">
            <TabsList>
              <TabsTrigger value="domains">My Domains</TabsTrigger>
              <TabsTrigger value="dns-help">DNS Setup Guide</TabsTrigger>
            </TabsList>

            <TabsContent value="domains" className="space-y-6">
              {domains.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Globe className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No domains configured</h3>
                    <p className="text-muted-foreground mb-4">
                      Add a custom domain to make your projects accessible via your own URL
                    </p>
                    <Button onClick={() => setShowAddDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Domain
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {domains.map((domain) => (
                    <Card key={domain.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(domain.verified, domain.ssl_status)}
                            <div>
                              <CardTitle className="text-lg">{domain.domain}</CardTitle>
                              <CardDescription>
                                Connected to {domain.project_name}
                              </CardDescription>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant={domain.verified ? 'default' : 'secondary'}>
                              {getStatusText(domain.verified, domain.ssl_status)}
                            </Badge>
                            
                            {domain.verified && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={`https://${domain.domain}`} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deleteDomain(domain.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {!domain.verified && (
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                                  DNS Configuration Required
                                </h4>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                                  Please add the following DNS records to verify your domain:
                                </p>
                                
                                <div className="space-y-2">
                                  {domain.dns_records.map((record, index) => (
                                    <div key={index} className="bg-white dark:bg-gray-800 rounded border p-3">
                                      <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                          <span className="font-medium">Type:</span> {record.type}
                                        </div>
                                        <div>
                                          <span className="font-medium">Name:</span> {record.name}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">Value:</span>
                                          <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">
                                            {record.value}
                                          </code>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyToClipboard(record.value)}
                                            className="h-6 w-6 p-0"
                                          >
                                            <Copy className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <Button 
                                  onClick={() => verifyDomain(domain.id)}
                                  className="mt-3"
                                  size="sm"
                                >
                                  Verify Domain
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="text-sm text-muted-foreground">
                          Added {new Date(domain.created_at).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="dns-help">
              <Card>
                <CardHeader>
                  <CardTitle>DNS Setup Guide</CardTitle>
                  <CardDescription>
                    Learn how to configure DNS records for your custom domains
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">For clean8.online subdomains:</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      If you're using a subdomain of clean8.online (e.g., myapp.clean8.online), 
                      DNS is automatically configured. Your domain should be active immediately.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">For custom domains:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Go to your domain registrar's DNS management panel</li>
                      <li>Add the DNS records provided when you add your domain</li>
                      <li>Wait for DNS propagation (can take up to 24 hours)</li>
                      <li>Click "Verify Domain" to check the configuration</li>
                      <li>Once verified, SSL certificate will be automatically provisioned</li>
                    </ol>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                      Need help?
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      If you're having trouble with DNS configuration, our support team is here to help. 
                      Contact us with your domain details and we'll assist you with the setup.
                    </p>
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
