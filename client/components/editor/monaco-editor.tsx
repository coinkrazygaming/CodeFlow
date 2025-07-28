import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  Download, 
  Play, 
  FileText, 
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface MonacoEditorProps {
  files: { [key: string]: string };
  activeFile: string;
  onFileChange: (filename: string, content: string) => void;
  onActiveFileChange: (filename: string) => void;
  onSave: () => void;
  onPreview: () => void;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  files,
  activeFile,
  onFileChange,
  onActiveFileChange,
  onSave,
  onPreview
}) => {
  const editorRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Configure Monaco themes and settings
    monaco.editor.defineTheme('codeflow-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
      ],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editor.lineHighlightBackground': '#2d2d30',
        'editor.selectionBackground': '#264f78',
      }
    });

    monaco.editor.setTheme('codeflow-dark');

    // Add custom keybindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onPreview();
    });
  };

  const getLanguageFromFilename = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'css':
        return 'css';
      case 'scss':
        return 'scss';
      case 'html':
        return 'html';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      default:
        return 'javascript';
    }
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return '📄';
      case 'css':
      case 'scss':
        return '🎨';
      case 'html':
        return '🌐';
      case 'json':
        return '⚙️';
      case 'md':
        return '📝';
      default:
        return '📄';
    }
  };

  const fileList = Object.keys(files);

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'h-full'}`}>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Code Editor
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onSave}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={onPreview}>
                <Play className="h-4 w-4 mr-1" />
                Preview
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 h-[calc(100%-80px)]">
          <Tabs value={activeFile} onValueChange={onActiveFileChange} className="h-full">
            <div className="border-b px-4">
              <TabsList className="grid w-full grid-cols-auto">
                {fileList.map((filename) => (
                  <TabsTrigger key={filename} value={filename} className="gap-2">
                    <span>{getFileIcon(filename)}</span>
                    {filename}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {fileList.map((filename) => (
              <TabsContent key={filename} value={filename} className="h-[calc(100%-50px)] m-0">
                <div className="h-full relative">
                  <Editor
                    height="100%"
                    language={getLanguageFromFilename(filename)}
                    value={files[filename]}
                    onChange={(value) => onFileChange(filename, value || '')}
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
                      parameterHints: {
                        enabled: true,
                      },
                      folding: true,
                      foldingStrategy: 'indentation',
                      showFoldingControls: 'always',
                      bracketPairColorization: {
                        enabled: true,
                      },
                    }}
                  />
                  
                  {/* Status bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-muted px-4 py-1 text-xs text-muted-foreground border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span>{getLanguageFromFilename(filename)}</span>
                        <span>UTF-8</span>
                        <span>LF</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="text-xs">
                          {files[filename]?.split('\n').length || 0} lines
                        </Badge>
                        <span>Spaces: 2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
