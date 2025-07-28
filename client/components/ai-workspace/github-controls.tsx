import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Github,
  GitBranch,
  Settings,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface GitHubRepo {
  id: string;
  name: string;
  fullName: string;
  description?: string;
  private: boolean;
  defaultBranch: string;
  lastPush: Date;
}

interface GitHubControlsProps {
  isConnected: boolean;
  onConnect: () => void;
  currentProject: any;
  onProjectLoad: (project: any) => void;
}

export function GitHubControls({
  isConnected,
  onConnect,
  currentProject,
  onProjectLoad,
}: GitHubControlsProps) {
  const [showRepoDialog, setShowRepoDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [newRepoName, setNewRepoName] = useState("");
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [cicdStatus, setCicdStatus] = useState<
    "not_setup" | "configuring" | "active" | "error"
  >("not_setup");

  const mockRepositories: GitHubRepo[] = [
    {
      id: "1",
      name: "my-react-app",
      fullName: "username/my-react-app",
      description: "A modern React application",
      private: false,
      defaultBranch: "main",
      lastPush: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
      id: "2",
      name: "api-backend",
      fullName: "username/api-backend",
      description: "Node.js API backend",
      private: true,
      defaultBranch: "main",
      lastPush: new Date(Date.now() - 3600000), // 1 hour ago
    },
    {
      id: "3",
      name: "landing-page",
      fullName: "username/landing-page",
      description: "Marketing landing page",
      private: false,
      defaultBranch: "main",
      lastPush: new Date(Date.now() - 172800000), // 2 days ago
    },
  ];

  const handleConnectGitHub = async () => {
    onConnect();

    // Simulate fetching repositories
    setIsLoadingRepos(true);
    setTimeout(() => {
      setRepositories(mockRepositories);
      setIsLoadingRepos(false);
    }, 1500);
  };

  const handleLoadRepository = async (repo: GitHubRepo) => {
    // Simulate loading repository files
    const project = {
      id: repo.id,
      name: repo.name,
      files: {
        "package.json": JSON.stringify(
          {
            name: repo.name,
            version: "1.0.0",
            dependencies: {
              react: "^18.0.0",
              typescript: "^5.0.0",
            },
          },
          null,
          2,
        ),
        "src/App.tsx": `import React from 'react';

function App() {
  return (
    <div className="App">
      <h1>Welcome to ${repo.name}</h1>
      <p>This project was loaded from GitHub!</p>
    </div>
  );
}

export default App;`,
        "README.md": `# ${repo.name}

${repo.description || "A great project"}

## Getting Started

This project was loaded into Josey AI workspace.
`,
      },
      githubRepo: repo.fullName,
      lastSnapshot: new Date(),
    };

    onProjectLoad(project);
    setShowRepoDialog(false);
  };

  const handleCreateRepository = async () => {
    if (!newRepoName.trim()) return;

    // Simulate creating a new repository
    const newRepo: GitHubRepo = {
      id: Date.now().toString(),
      name: newRepoName,
      fullName: `username/${newRepoName}`,
      description: "Created with Josey AI",
      private: false,
      defaultBranch: "main",
      lastPush: new Date(),
    };

    setRepositories((prev) => [newRepo, ...prev]);
    setNewRepoName("");
    setShowCreateDialog(false);

    // Auto-load the new repository
    handleLoadRepository(newRepo);
  };

  const setupCICD = async () => {
    setCicdStatus("configuring");

    // Simulate CI/CD setup
    setTimeout(() => {
      setCicdStatus("active");
    }, 3000);
  };

  const createPullRequest = async () => {
    if (!currentProject?.githubRepo) return;

    // Simulate creating a PR
    window.open(
      `https://github.com/${currentProject.githubRepo}/compare`,
      "_blank",
    );
  };

  const getCICDStatusIcon = () => {
    switch (cicdStatus) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "configuring":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Settings className="h-4 w-4 text-gray-400" />;
    }
  };

  const getCICDStatusText = () => {
    switch (cicdStatus) {
      case "active":
        return "CI/CD Active";
      case "configuring":
        return "Setting up...";
      case "error":
        return "Setup Failed";
      default:
        return "Setup CI/CD";
    }
  };

  if (!isConnected) {
    return (
      <Button onClick={handleConnectGitHub} variant="outline" className="gap-2">
        <Github className="h-4 w-4" />
        Connect GitHub
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Github className="h-4 w-4" />
            GitHub
            <Badge variant="secondary" className="ml-1">
              Connected
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Repository Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setShowRepoDialog(true)}>
            <GitBranch className="mr-2 h-4 w-4" />
            Load Repository
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Repository
          </DropdownMenuItem>

          {currentProject?.githubRepo && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={createPullRequest}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Create Pull Request
              </DropdownMenuItem>

              <DropdownMenuItem onClick={setupCICD}>
                {getCICDStatusIcon()}
                <span className="ml-2">{getCICDStatusText()}</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Load Repository Dialog */}
      <Dialog open={showRepoDialog} onOpenChange={setShowRepoDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Load GitHub Repository</DialogTitle>
            <DialogDescription>
              Choose a repository to load into your workspace
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {isLoadingRepos ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Loading repositories...
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-auto">
                {repositories.map((repo) => (
                  <div
                    key={repo.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleLoadRepository(repo)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{repo.name}</h3>
                          {repo.private && (
                            <Badge variant="secondary" className="text-xs">
                              Private
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {repo.description || "No description"}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Branch: {repo.defaultBranch}</span>
                          <span>
                            Updated: {repo.lastPush.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button size="sm">Load</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Repository Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Repository</DialogTitle>
            <DialogDescription>
              Create a new GitHub repository and set it up with CI/CD
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="repo-name">Repository Name</Label>
              <Input
                id="repo-name"
                placeholder="my-awesome-project"
                value={newRepoName}
                onChange={(e) => setNewRepoName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreateRepository}
                disabled={!newRepoName.trim()}
              >
                Create Repository
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {currentProject?.githubRepo && (
        <Badge variant="outline" className="gap-1">
          <GitBranch className="h-3 w-3" />
          {currentProject.githubRepo}
        </Badge>
      )}
    </div>
  );
}
