import { useState, useEffect } from 'react';
import { useSession } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  MoreHorizontal, 
  Github, 
  Globe, 
  Eye,
  Settings,
  Trash2,
  GitBranch,
  Rocket
} from 'lucide-react';

type Mode = 'preview' | 'dev' | 'build' | 'production';

interface Project {
  id: string;
  name: string;
  description?: string;
  github_repo?: string;
  deployment_url?: string;
  status: 'draft' | 'building' | 'deployed' | 'error';
  created_at: string;
}

interface ProjectGridProps {
  currentMode: Mode;
}

export function ProjectGrid({ currentMode }: ProjectGridProps) {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    github_repo: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async () => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });

      if (response.ok) {
        setShowCreateDialog(false);
        setNewProject({ name: '', description: '', github_repo: '' });
        fetchProjects();
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const deployProject = async (projectId: string) => {
    try {
      await fetch(`/api/projects/${projectId}/deploy`, { method: 'POST' });
      fetchProjects();
    } catch (error) {
      console.error('Error deploying project:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'bg-green-500';
      case 'building': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getModeIcon = (mode: Mode) => {
    switch (mode) {
      case 'preview': return <Eye className="h-4 w-4" />;
      case 'dev': return <GitBranch className="h-4 w-4" />;
      case 'build': return <Settings className="h-4 w-4" />;
      case 'production': return <Rocket className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Projects</h2>
          <p className="text-muted-foreground">
            Current mode: <span className="inline-flex items-center gap-1">
              {getModeIcon(currentMode)} {currentMode}
            </span>
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Start a new project or import from GitHub
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Awesome Project"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="A brief description of your project"
                />
              </div>
              <div>
                <Label htmlFor="github">GitHub Repository (Optional)</Label>
                <Input
                  id="github"
                  value={newProject.github_repo}
                  onChange={(e) => setNewProject(prev => ({ ...prev, github_repo: e.target.value }))}
                  placeholder="username/repository"
                />
              </div>
              <Button onClick={createProject} className="w-full" disabled={!newProject.name}>
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first project to get started with CodeFlow AI
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description || 'No description'}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => deployProject(project.id)}>
                        <Deploy className="mr-2 h-4 w-4" />
                        Deploy
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteProject(project.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(project.status)} text-white`}
                  >
                    {project.status}
                  </Badge>
                  {project.github_repo && (
                    <Badge variant="outline" className="gap-1">
                      <Github className="h-3 w-3" />
                      GitHub
                    </Badge>
                  )}
                  {project.deployment_url && (
                    <Badge variant="outline" className="gap-1">
                      <Globe className="h-3 w-3" />
                      Live
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    Open
                  </Button>
                  {project.deployment_url && (
                    <Button variant="outline" size="sm">
                      <Globe className="h-4 w-4" />
                    </Button>
                  )}
                  {project.github_repo && (
                    <Button variant="outline" size="sm">
                      <Github className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
