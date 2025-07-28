import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Save, 
  Plus, 
  FileText, 
  Folder,
  Trash2,
  Download,
  Upload,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Zap,
  RefreshCw
} from 'lucide-react';

interface CodeEditorProps {
  project: any;
  onProjectChange: (project: any) => void;
  onAIAction: (action: any) => void;
}

interface FileError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export function CodeEditor({ project, onProjectChange, onAIAction }: CodeEditorProps) {
  const [activeFile, setActiveFile] = useState<string>(Object.keys(project.files)[0] || '');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [errors, setErrors] = useState<{ [filename: string]: FileError[] }>({});
  const [aiSuggestions, setAISuggestions] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Configure Monaco for better AI integration
    monaco.editor.defineTheme('josey-ai-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'ai-suggestion', foreground: 'FFD700', fontStyle: 'italic' },
      ],
      colors: {
        'editor.background': '#0D1117',
        'editor.foreground': '#E6EDF3',
        'editor.lineHighlightBackground': '#161B22',
        'editor.selectionBackground': '#264F78',
        'editorSuggestWidget.background': '#161B22',
        'editorSuggestWidget.border': '#30363D',
      }
    });

    monaco.editor.setTheme('josey-ai-dark');

    // Add AI-powered autocompletion
    monaco.languages.registerCompletionItemProvider('typescript', {
      provideCompletionItems: (model, position) => {
        const suggestions = [
          {
            label: 'AI: Generate React Component',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '// AI will generate a complete React component here\n',
            detail: 'Josey AI will create a full component based on context',
            command: { id: 'ai.generateComponent', title: 'Generate Component' }
          },
          {
            label: 'AI: Add Error Handling',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '// AI will add comprehensive error handling\n',
            detail: 'Josey AI will add try-catch and error boundaries',
            command: { id: 'ai.addErrorHandling', title: 'Add Error Handling' }
          },
          {
            label: 'AI: Optimize Performance',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '// AI will optimize this code for performance\n',
            detail: 'Josey AI will suggest performance improvements',
            command: { id: 'ai.optimizeCode', title: 'Optimize Code' }
          }
        ];
        return { suggestions };
      }
    });

    // Real-time error detection
    editor.onDidChangeModelContent(() => {
      analyzeCode();
    });
  };

  const analyzeCode = async () => {
    if (!activeFile || !project.files[activeFile]) return;

    setIsAnalyzing(true);
    
    // Simulate AI code analysis
    setTimeout(() => {
      const fileContent = project.files[activeFile];
      const mockErrors: FileError[] = [];

      // Simple error detection (in real implementation, this would be AI-powered)
      const lines = fileContent.split('\n');
      lines.forEach((line, index) => {
        if (line.includes('console.log') && !line.includes('//')) {
          mockErrors.push({
            line: index + 1,
            column: line.indexOf('console.log') + 1,
            message: 'Consider removing console.log statements in production',
            severity: 'warning'
          });
        }
        if (line.includes('any') && line.includes(':')) {
          mockErrors.push({
            line: index + 1,
            column: line.indexOf('any') + 1,
            message: 'Avoid using "any" type. Consider using specific types',
            severity: 'warning'
          });
        }
      });

      setErrors(prev => ({ ...prev, [activeFile]: mockErrors }));
      
      // Generate AI suggestions
      generateAISuggestions(fileContent);
      setIsAnalyzing(false);
    }, 1000);
  };

  const generateAISuggestions = (content: string) => {
    const suggestions = [];
    
    if (content.includes('useState') && !content.includes('useEffect')) {
      suggestions.push('Add useEffect hook for side effects');
    }
    if (content.includes('function') && !content.includes('export')) {
      suggestions.push('Consider exporting this function for reusability');
    }
    if (!content.includes('PropTypes') && !content.includes('interface')) {
      suggestions.push('Add TypeScript interfaces or PropTypes for type safety');
    }
    if (content.includes('fetch') && !content.includes('try')) {
      suggestions.push('Add error handling for API calls');
    }
    
    setAISuggestions(suggestions);
  };

  const handleFileChange = (filename: string, content: string) => {
    const updatedProject = {
      ...project,
      files: {
        ...project.files,
        [filename]: content
      }
    };
    onProjectChange(updatedProject);
  };

  const createNewFile = () => {
    if (!newFileName.trim()) return;
    
    const extension = newFileName.split('.').pop()?.toLowerCase();
    let template = '';
    
    switch (extension) {
      case 'tsx':
      case 'jsx':
        template = `import React from 'react';

interface ${newFileName.split('.')[0]}Props {
  // Define props here
}

export function ${newFileName.split('.')[0]}({}: ${newFileName.split('.')[0]}Props) {
  return (
    <div>
      <h1>${newFileName.split('.')[0]} Component</h1>
    </div>
  );
}

export default ${newFileName.split('.')[0]};`;
        break;
      case 'ts':
        template = `// ${newFileName}

export interface ExampleInterface {
  id: string;
  name: string;
}

export function exampleFunction(): void {
  console.log('Hello from ${newFileName}');
}`;
        break;
      case 'css':
        template = `/* ${newFileName} */

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}`;
        break;
      default:
        template = `// ${newFileName}\n\n// Your code here`;
    }

    handleFileChange(newFileName, template);
    setActiveFile(newFileName);
    setNewFileName('');
    setShowCreateDialog(false);
  };

  const deleteFile = (filename: string) => {
    if (Object.keys(project.files).length <= 1) return;
    
    const { [filename]: deleted, ...remainingFiles } = project.files;
    const updatedProject = {
      ...project,
      files: remainingFiles
    };
    
    onProjectChange(updatedProject);
    
    if (activeFile === filename) {
      setActiveFile(Object.keys(remainingFiles)[0] || '');
    }
  };

  const applyAISuggestion = async (suggestion: string) => {
    const action = {
      id: Date.now().toString(),
      type: 'improvement_suggestion',
      timestamp: new Date(),
      input: suggestion,
      output: '',
      status: 'pending'
    };
    
    onAIAction(action);
    
    // Simulate AI applying the suggestion
    setTimeout(() => {
      // In real implementation, this would call the AI service
      const improvedCode = project.files[activeFile] + '\n\n// AI improvement applied: ' + suggestion;
      handleFileChange(activeFile, improvedCode);
      
      // Remove the applied suggestion
      setAISuggestions(prev => prev.filter(s => s !== suggestion));
    }, 2000);
  };

  const getLanguageFromFilename = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'ts': case 'tsx': return 'typescript';
      case 'js': case 'jsx': return 'javascript';
      case 'css': return 'css';
      case 'scss': return 'scss';
      case 'html': return 'html';
      case 'json': return 'json';
      case 'md': return 'markdown';
      default: return 'typescript';
    }
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'ts': case 'tsx': case 'js': case 'jsx': return '📄';
      case 'css': case 'scss': return '🎨';
      case 'html': return '🌐';
      case 'json': return '⚙️';
      case 'md': return '📝';
      default: return '📄';
    }
  };

  const exportProject = () => {
    const projectData = {
      name: project.name,
      files: project.files,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex">
      {/* File Explorer */}
      <div className="w-64 border-r bg-muted/30">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm">Files</h3>
            <div className="flex gap-1">
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="ghost">
                    <Plus className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New File</DialogTitle>
                    <DialogDescription>Enter the filename with extension</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="components/Button.tsx"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button onClick={createNewFile} disabled={!newFileName.trim()}>
                        Create
                      </Button>
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button size="sm" variant="ghost" onClick={exportProject}>
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-1">
            {Object.keys(project.files).map((filename) => (
              <div 
                key={filename}
                className={`flex items-center justify-between p-2 rounded text-sm cursor-pointer hover:bg-muted ${
                  activeFile === filename ? 'bg-muted' : ''
                }`}
                onClick={() => setActiveFile(filename)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span>{getFileIcon(filename)}</span>
                  <span className="truncate">{filename}</span>
                  {errors[filename]?.length > 0 && (
                    <div className="flex gap-1">
                      {errors[filename].some(e => e.severity === 'error') && (
                        <AlertTriangle className="h-3 w-3 text-red-500" />
                      )}
                      {errors[filename].some(e => e.severity === 'warning') && (
                        <AlertTriangle className="h-3 w-3 text-yellow-500" />
                      )}
                    </div>
                  )}
                </div>
                {Object.keys(project.files).length > 1 && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(filename);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-brand-500" />
              <h4 className="font-medium text-sm">AI Suggestions</h4>
              {isAnalyzing && <RefreshCw className="h-3 w-3 animate-spin" />}
            </div>
            <div className="space-y-2">
              {aiSuggestions.slice(0, 3).map((suggestion, index) => (
                <div key={index} className="text-xs bg-background rounded p-2">
                  <p className="mb-2">{suggestion}</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-6 text-xs"
                    onClick={() => applyAISuggestion(suggestion)}
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Apply
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col">
        {activeFile && (
          <>
            {/* File Tabs */}
            <div className="border-b bg-background">
              <div className="flex items-center px-4 py-2">
                <span className="text-sm font-medium">{activeFile}</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {getLanguageFromFilename(activeFile)}
                </Badge>
                {errors[activeFile]?.length > 0 && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    {errors[activeFile].length} issues
                  </Badge>
                )}
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 relative">
              <Editor
                height="100%"
                language={getLanguageFromFilename(activeFile)}
                value={project.files[activeFile]}
                onChange={(value) => handleFileChange(activeFile, value || '')}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  wordWrap: 'on',
                  suggest: {
                    showKeywords: true,
                    showSnippets: true,
                  },
                  quickSuggestions: {
                    other: true,
                    comments: true,
                    strings: true,
                  },
                  parameterHints: { enabled: true },
                  folding: true,
                  bracketPairColorization: { enabled: true },
                  lightbulb: { enabled: true },
                  codeActionsOnSave: { enabled: true },
                }}
              />
              
              {/* Error Panel */}
              {errors[activeFile]?.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-background border-t max-h-32 overflow-auto">
                  <div className="p-2 space-y-1">
                    {errors[activeFile].map((error, index) => (
                      <div key={index} className="flex items-start gap-2 text-xs">
                        <AlertTriangle className={`h-3 w-3 mt-0.5 ${
                          error.severity === 'error' ? 'text-red-500' : 'text-yellow-500'
                        }`} />
                        <div>
                          <span className="font-medium">Line {error.line}:</span>
                          <span className="ml-1">{error.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
