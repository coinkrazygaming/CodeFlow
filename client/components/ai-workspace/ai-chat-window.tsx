import React, { useState, useRef, useEffect, forwardRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  Send,
  Minimize2,
  Maximize2,
  MessageSquare,
  Sparkles,
  Code,
  FileText,
  GitBranch,
  Zap,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

interface AIMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
  actionType?:
    | "code_generation"
    | "file_creation"
    | "error_analysis"
    | "improvement";
}

interface AIChatWindowProps {
  onMessage: (message: string) => void;
  currentProject: any;
  actions: any[];
  onAutoExecute: (callback: () => void) => void;
}

export const AIChatWindow = forwardRef<HTMLDivElement, AIChatWindowProps>(
  ({ onMessage, currentProject, actions, onAutoExecute }, ref) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<AIMessage[]>([
      {
        id: "1",
        content:
          "Hi! I'm Josey AI, your development assistant. I can help you generate code, analyze errors, create files, and guide you through the development process. What would you like to build today?",
        isUser: false,
        timestamp: new Date(),
        suggestions: [
          "Help me fix this error",
          "Generate a React component",
          "Create API endpoints",
          "Optimize my code",
        ],
      },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    // Real-time suggestions based on input
    useEffect(() => {
      if (inputValue.length > 2) {
        const timer = setTimeout(() => {
          generateSuggestions(inputValue);
        }, 500);
        return () => clearTimeout(timer);
      } else {
        setSuggestions([]);
      }
    }, [inputValue]);

    const generateSuggestions = (input: string) => {
      const lowerInput = input.toLowerCase();
      const suggestionsMap = {
        create: [
          "Create a React component with TypeScript",
          "Create API endpoints for CRUD operations",
          "Create a database schema",
          "Create unit tests",
        ],
        fix: [
          "Fix TypeScript errors",
          "Fix CSS layout issues",
          "Fix API connection problems",
          "Fix performance issues",
        ],
        generate: [
          "Generate a complete form component",
          "Generate authentication system",
          "Generate API documentation",
          "Generate deployment scripts",
        ],
        analyze: [
          "Analyze code for improvements",
          "Analyze security vulnerabilities",
          "Analyze performance bottlenecks",
          "Analyze accessibility issues",
        ],
      };

      for (const [key, suggestions] of Object.entries(suggestionsMap)) {
        if (lowerInput.includes(key)) {
          setSuggestions(suggestions);
          return;
        }
      }

      // General suggestions
      setSuggestions([
        "Add error handling and validation",
        "Implement responsive design",
        "Add TypeScript types",
        "Set up testing framework",
      ]);
    };

    const handleSendMessage = async () => {
      if (!inputValue.trim()) return;

      const userMessage: AIMessage = {
        id: Date.now().toString(),
        content: inputValue,
        isUser: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setSuggestions([]);
      setIsTyping(true);

      // Call parent onMessage handler
      onMessage(inputValue);

      // Simulate AI processing and response
      setTimeout(() => {
        const aiResponse: AIMessage = {
          id: (Date.now() + 1).toString(),
          content: generateAIResponse(inputValue),
          isUser: false,
          timestamp: new Date(),
          actionType: detectActionType(inputValue),
          suggestions: generateFollowUpSuggestions(inputValue),
        };

        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);

        // Auto-execute if it's a code generation request
        if (aiResponse.actionType === "code_generation") {
          onAutoExecute(() => {
            console.log("Auto-executing code generation");
          });
        }
      }, 1500);
    };

    const generateAIResponse = (input: string): string => {
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes("create") || lowerInput.includes("generate")) {
        return "I'll help you create that! I'm analyzing your requirements and will generate the appropriate code structure. I'll create the files and components you need, along with proper TypeScript types and error handling.";
      }

      if (lowerInput.includes("fix") || lowerInput.includes("error")) {
        return "Let me analyze the errors in your project. I'll scan through your code, identify the issues, and provide fixes. I can also suggest improvements to prevent similar issues in the future.";
      }

      if (lowerInput.includes("deploy") || lowerInput.includes("ci/cd")) {
        return "I'll help you set up deployment and CI/CD pipelines. I can configure GitHub Actions, set up automated testing, and deploy to various platforms like Vercel, Netlify, or your preferred hosting service.";
      }

      return "I understand your request. Let me analyze the best approach and provide you with a solution. I'll break this down into steps and guide you through the implementation.";
    };

    const detectActionType = (input: string): AIMessage["actionType"] => {
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes("create") || lowerInput.includes("generate")) {
        return "code_generation";
      }
      if (lowerInput.includes("file")) {
        return "file_creation";
      }
      if (lowerInput.includes("error") || lowerInput.includes("fix")) {
        return "error_analysis";
      }
      if (lowerInput.includes("improve") || lowerInput.includes("optimize")) {
        return "improvement";
      }
      return undefined;
    };

    const generateFollowUpSuggestions = (input: string): string[] => {
      return [
        "Add tests for this code",
        "Set up error boundaries",
        "Add loading states",
        "Implement accessibility features",
      ];
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    const getActionIcon = (type?: string) => {
      switch (type) {
        case "code_generation":
          return <Code className="h-3 w-3" />;
        case "file_creation":
          return <FileText className="h-3 w-3" />;
        case "error_analysis":
          return <Zap className="h-3 w-3" />;
        case "improvement":
          return <Sparkles className="h-3 w-3" />;
        default:
          return <Bot className="h-3 w-3" />;
      }
    };

    if (isMinimized) {
      return (
        <div ref={ref} className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setIsMinimized(false)}
            className="rounded-full w-12 h-12 shadow-lg"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className="fixed bottom-4 right-4 w-96 h-[600px] z-50 shadow-2xl"
      >
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-2 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-brand-500" />
                <CardTitle className="text-lg">Josey AI</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>

            {currentProject && (
              <div className="text-xs text-muted-foreground">
                Working on: {currentProject.name}
              </div>
            )}
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
            {/* Messages Area */}
            <ScrollArea className="flex-1">
              <div className="space-y-3 pr-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 text-sm ${
                        message.isUser ? "bg-brand-500 text-white" : "bg-muted"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {!message.isUser && (
                          <div className="mt-0.5">
                            {getActionIcon(message.actionType)}
                          </div>
                        )}
                        <div className="flex-1">
                          {message.content}

                          {message.suggestions && (
                            <div className="mt-2 space-y-1">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-1 text-xs justify-start bg-white/10 hover:bg-white/20"
                                  onClick={() => setInputValue(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <div className="bg-muted rounded-lg p-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Bot className="h-3 w-3" />
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="flex-shrink-0">
                <div className="text-xs text-muted-foreground mb-1">
                  Suggestions:
                </div>
                <div className="space-y-1">
                  {suggestions.slice(0, 2).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="h-auto p-2 text-xs w-full justify-start"
                      onClick={() => setInputValue(suggestion)}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="flex-shrink-0 space-y-2">
              <div className="flex gap-2">
                <Textarea
                  ref={inputRef}
                  placeholder="Ask Josey AI anything about your project..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 min-h-[60px] resize-none"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                  className="h-[60px] w-[60px] flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                Press Enter to send • Shift+Enter for new line
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
);

AIChatWindow.displayName = "AIChatWindow";
