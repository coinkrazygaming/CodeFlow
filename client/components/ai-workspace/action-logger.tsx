import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  MessageSquare, 
  Code, 
  AlertTriangle, 
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Search,
  Filter
} from 'lucide-react';

interface ActionLoggerProps {
  actions: any[];
}

export function ActionLogger({ actions }: ActionLoggerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeLogTab, setActiveLogTab] = useState('all');

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'chat': return <MessageSquare className="h-4 w-4" />;
      case 'code_generation': return <Code className="h-4 w-4" />;
      case 'file_creation': return <FileText className="h-4 w-4" />;
      case 'error_analysis': return <AlertTriangle className="h-4 w-4" />;
      case 'improvement_suggestion': return <Sparkles className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'error': return <XCircle className="h-3 w-3 text-red-500" />;
      default: return <Clock className="h-3 w-3 text-yellow-500" />;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'chat': return 'bg-blue-500';
      case 'code_generation': return 'bg-green-500';
      case 'file_creation': return 'bg-purple-500';
      case 'error_analysis': return 'bg-red-500';
      case 'improvement_suggestion': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredActions = actions.filter(action => {
    if (activeLogTab === 'all') return true;
    return action.type === activeLogTab;
  });

  const exportLogs = () => {
    const logData = {
      timestamp: new Date().toISOString(),
      totalActions: actions.length,
      actions: actions.map(action => ({
        ...action,
        timestamp: action.timestamp.toISOString()
      }))
    };

    const blob = new Blob([JSON.stringify(logData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `josey-ai-logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 left-4 z-50 shadow-lg"
      >
        <FileText className="h-4 w-4 mr-2" />
        View Logs ({actions.length})
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 w-96 h-[600px] z-50 shadow-2xl">
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Action Logs
              </CardTitle>
              <CardDescription>
                All AI actions and system events
              </CardDescription>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={exportLogs}
              >
                <Download className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVisible(false)}
              >
                ×
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-3 overflow-hidden">
          <Tabs value={activeLogTab} onValueChange={setActiveLogTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 mb-3">
              <TabsTrigger value="all" className="text-xs">
                All ({actions.length})
              </TabsTrigger>
              <TabsTrigger value="chat" className="text-xs">
                Chat
              </TabsTrigger>
              <TabsTrigger value="code_generation" className="text-xs">
                Code
              </TabsTrigger>
              <TabsTrigger value="error_analysis" className="text-xs">
                Errors
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeLogTab} className="flex-1 m-0">
              <ScrollArea className="h-full">
                <div className="space-y-3 pr-3">
                  {filteredActions.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-sm text-muted-foreground">
                        No {activeLogTab === 'all' ? 'actions' : activeLogTab} logged yet
                      </p>
                    </div>
                  ) : (
                    filteredActions.map((action) => (
                      <Card key={action.id} className="text-sm">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <div className={`p-1.5 rounded-full ${getActionColor(action.type)} text-white flex-shrink-0`}>
                              {getActionIcon(action.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {action.type.replace('_', ' ')}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(action.status)}
                                  <span className="text-xs text-muted-foreground">
                                    {action.timestamp.toLocaleTimeString()}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1">Input:</div>
                                  <div className="text-xs bg-muted p-2 rounded">
                                    {action.input.length > 100 
                                      ? `${action.input.substring(0, 100)}...` 
                                      : action.input}
                                  </div>
                                </div>
                                
                                {action.output && (
                                  <div>
                                    <div className="text-xs text-muted-foreground mb-1">Output:</div>
                                    <div className="text-xs bg-muted p-2 rounded">
                                      {action.output.length > 100 
                                        ? `${action.output.substring(0, 100)}...` 
                                        : action.output}
                                    </div>
                                  </div>
                                )}

                                {action.projectSnapshot && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    Snapshot created before action
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
