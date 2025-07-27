import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Eye,
  Code,
  Hammer,
  Rocket,
  ChevronDown,
  Settings,
  LogOut,
  CreditCard,
  FileText,
  BarChart3,
  Bot,
  Github,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Mode = 'preview' | 'dev' | 'build' | 'production';

interface NavbarProps {
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
}

export function Navbar({ currentMode, onModeChange }: NavbarProps) {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const [aiEditsUsed] = useState(session?.user?.ai_edits_used || 0);
  const isPremium = session?.user?.subscription_tier === 'premium';

  const tools = [
    { name: 'Projects', icon: FileText, href: '/dashboard' },
    { name: 'Josey AI', icon: Bot, href: '/dashboard/ai' },
    { name: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
    { name: 'Domains', icon: Globe, href: '/dashboard/domains' },
    { name: 'GitHub', icon: Github, href: '/dashboard/github' },
    { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  const modes = [
    { id: 'preview' as Mode, label: 'Preview', icon: Eye, color: 'bg-blue-500' },
    { id: 'dev' as Mode, label: 'Dev', icon: Code, color: 'bg-green-500' },
    { id: 'build' as Mode, label: 'Build', icon: Hammer, color: 'bg-yellow-500' },
    { id: 'production' as Mode, label: 'Production', icon: Rocket, color: 'bg-red-500' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700" />
            <span className="text-xl font-bold">CodeFlow AI</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Tools <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {tools.map((tool) => (
                <DropdownMenuItem
                  key={tool.name}
                  onClick={() => navigate(tool.href)}
                  className="gap-2"
                >
                  <tool.icon className="h-4 w-4" />
                  {tool.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const isActive = currentMode === mode.id;
              return (
                <Button
                  key={mode.id}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onModeChange(mode.id)}
                  className={cn(
                    'gap-2',
                    isActive && mode.color
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {mode.label}
                </Button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant={isPremium ? 'default' : 'secondary'}>
              {isPremium ? 'Premium' : 'Free'}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {aiEditsUsed}/{isPremium ? '1000' : '25'} AI edits
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                  <AvatarFallback>
                    {session?.user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard/billing')}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
