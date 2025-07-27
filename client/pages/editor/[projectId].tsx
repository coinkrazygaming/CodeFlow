import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Navbar } from '@/components/dashboard/navbar';
import { VisualEditor } from '@/components/editor/visual-editor';
import { MonacoEditor } from '@/components/editor/monaco-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Code, 
  Layout, 
  Save, 
  Download, 
  Share,
  Settings,
  GitBranch,
  Deploy,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

type Mode = 'preview' | 'dev' | 'build' | 'production';
type EditorTab = 'visual' | 'code' | 'preview';
type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export default function ProjectEditor() {
  const { projectId } = useParams();
  
  const [currentMode, setCurrentMode] = useState<Mode>('dev');
  const [activeTab, setActiveTab] = useState<EditorTab>('visual');
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');
  
  const [files, setFiles] = useState<{ [key: string]: string }>({
    'App.tsx': `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to CodeFlow AI</h1>
        <p>Start building your amazing project!</p>
      </header>
    </div>
  );
}

export default App;`,
    'App.css': `.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
}`,
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My CodeFlow Project</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>`
  });
  
  const [activeFile, setActiveFile] = useState('App.tsx');
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await fetch(`/api/projects/${projectId}/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files })
      });
      // Show success toast
    } catch (error) {
      console.error('Error saving files:', error);
    }
  };

  const handlePreview = () => {
    setActiveTab('preview');
  };

  const handleFileChange = (filename: string, content: string) => {
    setFiles(prev => ({ ...prev, [filename]: content }));
  };

  const handleExport = () => {
    const projectData = {
      files,
      project,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.name || 'project'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getViewportClass = () => {
    switch (viewportSize) {
      case 'mobile': return 'max-w-sm mx-auto';
      case 'tablet': return 'max-w-2xl mx-auto';
      default: return 'w-full';
    }
  };

  const getViewportIcon = (size: ViewportSize) => {
    switch (size) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
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
        
        {/* Editor Header */}
        <div className="border-b bg-background">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-xl font-bold">{project?.name || 'Untitled Project'}</h1>
                  <p className="text-sm text-muted-foreground">
                    {project?.description || 'No description'}
                  </p>
                </div>
                <Badge variant={project?.status === 'deployed' ? 'default' : 'secondary'}>
                  {project?.status || 'draft'}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button size="sm">
                  <Deploy className="h-4 w-4 mr-1" />
                  Deploy
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Editor Tabs */}
        <div className="border-b">
          <div className="container">
            <Tabs value={activeTab} onValueChange={(tab) => setActiveTab(tab as EditorTab)}>
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="visual" className="gap-2">
                    <Layout className="h-4 w-4" />
                    Visual
                  </TabsTrigger>
                  <TabsTrigger value="code" className="gap-2">
                    <Code className="h-4 w-4" />
                    Code
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>

                {activeTab === 'preview' && (
                  <div className="flex items-center gap-2">
                    {(['desktop', 'tablet', 'mobile'] as ViewportSize[]).map((size) => (
                      <Button
                        key={size}
                        variant={viewportSize === size ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewportSize(size)}
                      >
                        {getViewportIcon(size)}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </Tabs>
          </div>
        </div>

        {/* Editor Content */}
        <div className="h-[calc(100vh-200px)]">
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="visual" className="h-full m-0">
              <VisualEditor />
            </TabsContent>

            <TabsContent value="code" className="h-full m-0 p-4">
              <MonacoEditor
                files={files}
                activeFile={activeFile}
                onFileChange={handleFileChange}
                onActiveFileChange={setActiveFile}
                onSave={handleSave}
                onPreview={handlePreview}
              />
            </TabsContent>

            <TabsContent value="preview" className="h-full m-0 p-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Live Preview
                    <Badge variant="secondary">{viewportSize}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[calc(100%-80px)]">
                  <div className={`h-full border rounded-lg bg-white ${getViewportClass()}`}>
                    <iframe
                      src="/api/preview"
                      className="w-full h-full rounded-lg"
                      title="Project Preview"
                    />
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
