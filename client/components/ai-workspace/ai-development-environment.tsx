import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Github,
  Code,
  Play,
  Save,
  Download,
  GitBranch,
  Settings,
  Eye,
  Terminal,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  MessageSquare,
  FileText,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { AIChatWindow } from "./ai-chat-window";
import { CodeEditor } from "./code-editor";
import { GitHubControls } from "./github-controls";
import { ProjectSnapshot } from "./project-snapshot";
import { DeploymentStatus } from "./deployment-status";
import { ActionLogger } from "./action-logger";

interface Project {
  id: string;
  name: string;
  files: { [key: string]: string };
  githubRepo?: string;
  deploymentUrl?: string;
  lastSnapshot?: Date;
}

interface AIAction {
  id: string;
  type:
    | "chat"
    | "code_generation"
    | "file_creation"
    | "error_analysis"
    | "improvement_suggestion";
  timestamp: Date;
  input: string;
  output: string;
  status: "pending" | "completed" | "error";
  projectSnapshot?: string;
}

export function AIDevelopmentEnvironment() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const [aiActions, setAIActions] = useState<AIAction[]>([]);
  const [isConnectedToGitHub, setIsConnectedToGitHub] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<
    "idle" | "building" | "deployed" | "error"
  >("idle");
  const [autoExecuteTimer, setAutoExecuteTimer] =
    useState<NodeJS.Timeout | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Quick start prompts
  const quickStartPrompts = [
    {
      id: "fullstack-app",
      title: "Generate a full-stack app",
      description:
        "Create a complete React + Node.js application with database",
      icon: Code,
      prompt:
        "Create a full-stack application with React frontend, Node.js backend, and PostgreSQL database. Include authentication, CRUD operations, and responsive design.",
    },
    {
      id: "website",
      title: "Create a website",
      description: "Build a modern responsive website",
      icon: Globe,
      prompt:
        "Create a modern, responsive website with landing page, about section, services, and contact form. Use React and Tailwind CSS.",
    },
    {
      id: "ad-video",
      title: "Make a 30-second ad video",
      description: "Generate video advertisement content",
      icon: Play,
      prompt:
        "Create a 30-second promotional video script and storyboard for a tech product launch, including voiceover text and visual descriptions.",
    },
    {
      id: "image-banner",
      title: "Design an image/banner",
      description: "Create visual designs and graphics",
      icon: Sparkles,
      prompt:
        "Design a professional banner image for a SaaS product with modern gradients, clean typography, and compelling call-to-action.",
    },
  ];

  const handleQuickStart = async (prompt: string) => {
    // Create project snapshot before major action
    if (currentProject) {
      await createProjectSnapshot();
    }

    const action: AIAction = {
      id: Date.now().toString(),
      type: "code_generation",
      timestamp: new Date(),
      input: prompt,
      output: "",
      status: "pending",
      projectSnapshot: currentProject?.id,
    };

    setAIActions((prev) => [...prev, action]);

    // Start auto-execute timer
    startAutoExecuteTimer(() => executeAIAction(action));
  };

  const startAutoExecuteTimer = (callback: () => void) => {
    if (autoExecuteTimer) {
      clearTimeout(autoExecuteTimer);
    }

    setPendingAction("Proceeding automatically in 5 seconds...");

    const timer = setTimeout(() => {
      setPendingAction(null);
      callback();
    }, 5000);

    setAutoExecuteTimer(timer);
  };

  const cancelAutoExecute = () => {
    if (autoExecuteTimer) {
      clearTimeout(autoExecuteTimer);
      setAutoExecuteTimer(null);
      setPendingAction(null);
    }
  };

  const executeAIAction = async (action: AIAction) => {
    try {
      // Simulate AI processing
      const response = await fetch("/api/ai/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: action.input,
          type: action.type,
          projectContext: currentProject,
        }),
      });

      const result = await response.json();

      // Update action with result
      setAIActions((prev) =>
        prev.map((a) =>
          a.id === action.id
            ? { ...a, output: result.output, status: "completed" }
            : a,
        ),
      );

      // Apply changes to project if applicable
      if (result.files && currentProject) {
        setCurrentProject((prev) => ({
          ...prev!,
          files: { ...prev!.files, ...result.files },
        }));
      }
    } catch (error) {
      setAIActions((prev) =>
        prev.map((a) =>
          a.id === action.id
            ? { ...a, status: "error", output: `Error: ${error.message}` }
            : a,
        ),
      );
    }
  };

  const createProjectSnapshot = async () => {
    if (!currentProject) return;

    const snapshot = {
      id: Date.now().toString(),
      projectId: currentProject.id,
      files: { ...currentProject.files },
      timestamp: new Date(),
      description: "Auto-snapshot before AI action",
    };

    // Store snapshot (would be persisted in real implementation)
    localStorage.setItem(`snapshot_${snapshot.id}`, JSON.stringify(snapshot));

    setCurrentProject((prev) => ({
      ...prev!,
      lastSnapshot: new Date(),
    }));
  };

  const connectToGitHub = async () => {
    // GitHub OAuth flow would be implemented here
    setIsConnectedToGitHub(true);

    // Log the action
    const action: AIAction = {
      id: Date.now().toString(),
      type: "chat",
      timestamp: new Date(),
      input: "Connected to GitHub",
      output:
        "Successfully connected to GitHub. You can now import repositories and set up CI/CD workflows.",
      status: "completed",
    };

    setAIActions((prev) => [...prev, action]);
  };

  const deployProject = async () => {
    if (!currentProject) return;

    setDeploymentStatus("building");

    // Simulate deployment process
    setTimeout(() => {
      setDeploymentStatus("deployed");
      setCurrentProject((prev) => ({
        ...prev!,
        deploymentUrl: `https://${prev!.name.toLowerCase()}.codeflow.app`,
      }));
    }, 3000);
  };

  return (
    <div
      className={`ai-development-environment ${isFullscreen ? "fixed inset-0 z-50 bg-background" : "relative"}`}
    >
      {/* Header Controls */}
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-brand-500" />
                <h2 className="text-xl font-bold">Josey AI Workspace</h2>
              </div>

              {currentProject && (
                <Badge variant="outline" className="gap-1">
                  <FileText className="h-3 w-3" />
                  {currentProject.name}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <GitHubControls
                isConnected={isConnectedToGitHub}
                onConnect={connectToGitHub}
                currentProject={currentProject}
                onProjectLoad={setCurrentProject}
              />

              <DeploymentStatus
                status={deploymentStatus}
                deploymentUrl={currentProject?.deploymentUrl}
                onDeploy={deployProject}
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-execute notification */}
      {pendingAction && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                {pendingAction}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={cancelAutoExecute}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Quick Start Prompts */}
      {!currentProject && (
        <div className="container py-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">
              Get Started with Josey AI
            </h3>
            <p className="text-muted-foreground">
              Choose a quick start option or connect your GitHub repository
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickStartPrompts.map((prompt) => {
              const Icon = prompt.icon;
              return (
                <Card
                  key={prompt.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-100 rounded-lg">
                        <Icon className="h-5 w-5 text-brand-600" />
                      </div>
                      <CardTitle className="text-base">
                        {prompt.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {prompt.description}
                    </p>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleQuickStart(prompt.prompt)}
                    >
                      Start Project
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Workspace */}
      {currentProject && (
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="h-full flex flex-col"
            >
              <div className="border-b px-4">
                <TabsList>
                  <TabsTrigger value="code">Code Editor</TabsTrigger>
                  <TabsTrigger value="preview">Live Preview</TabsTrigger>
                  <TabsTrigger value="terminal">Terminal</TabsTrigger>
                  <TabsTrigger value="snapshots">Snapshots</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="code" className="flex-1 m-0">
                <CodeEditor
                  project={currentProject}
                  onProjectChange={setCurrentProject}
                  onAIAction={(action) =>
                    setAIActions((prev) => [...prev, action])
                  }
                />
              </TabsContent>

              <TabsContent value="preview" className="flex-1 m-0 p-4">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Live Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[calc(100%-80px)]">
                    <div className="w-full h-full border rounded-lg bg-white">
                      <iframe
                        src="/api/preview"
                        className="w-full h-full rounded-lg"
                        title="Live Preview"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="terminal" className="flex-1 m-0 p-4">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="h-5 w-5" />
                      Terminal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[calc(100%-80px)]">
                    <div className="bg-black text-green-400 font-mono text-sm p-4 rounded-lg h-full overflow-auto">
                      <div>$ npm run dev</div>
                      <div>Starting development server...</div>
                      <div>✓ Server running on port 3000</div>
                      <div className="cursor">▋</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="snapshots" className="flex-1 m-0 p-4">
                <ProjectSnapshot
                  project={currentProject}
                  onRestore={(snapshotId) => {
                    // Implement snapshot restoration
                    console.log("Restoring snapshot:", snapshotId);
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {/* AI Chat Window - Docked Bottom Right */}
      <AIChatWindow
        ref={chatWindowRef}
        onMessage={(message) => {
          const action: AIAction = {
            id: Date.now().toString(),
            type: "chat",
            timestamp: new Date(),
            input: message,
            output: "",
            status: "pending",
          };
          setAIActions((prev) => [...prev, action]);
          executeAIAction(action);
        }}
        currentProject={currentProject}
        actions={aiActions}
        onAutoExecute={startAutoExecuteTimer}
      />

      {/* Action Logger */}
      <ActionLogger actions={aiActions} />
    </div>
  );
}
