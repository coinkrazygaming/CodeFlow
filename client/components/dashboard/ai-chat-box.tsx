import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, Sparkles, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export function AIChatBox() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi! I'm Josey AI, your coding assistant. I can help you build apps, debug code, manage deployments, and even create social media content. What would you like to work on today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const aiEditsUsed = session?.user?.ai_edits_used || 0;
  const isPremium = session?.user?.subscription_tier === 'premium';
  const editsLimit = isPremium ? 1000 : 25;
  const editsRemaining = editsLimit - aiEditsUsed;

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    if (editsRemaining <= 0) {
      alert('You\'ve reached your AI edit limit. Please upgrade to Premium for unlimited edits.');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      });

      const data = await response.json();

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.content || 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-brand-500" />
            <CardTitle>Josey AI</CardTitle>
          </div>
          <Badge variant={isPremium ? 'default' : 'secondary'}>
            <Sparkles className="h-3 w-3 mr-1" />
            {editsRemaining} edits left
          </Badge>
        </div>
        <CardDescription>
          Your AI coding assistant for step-by-step help
        </CardDescription>
        {editsRemaining <= 10 && editsRemaining > 0 && (
          <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-yellow-700 dark:text-yellow-300">
              Only {editsRemaining} AI edits remaining
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.isUser ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg p-3 text-sm',
                    message.isUser
                      ? 'bg-brand-500 text-white'
                      : 'bg-muted'
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="bg-muted rounded-lg p-3 text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Textarea
            placeholder="Ask Josey AI for help with coding, debugging, or project ideas..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 min-h-[60px]"
            disabled={isLoading || editsRemaining <= 0}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!input.trim() || isLoading || editsRemaining <= 0}
            size="icon"
            className="h-[60px] w-[60px]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
