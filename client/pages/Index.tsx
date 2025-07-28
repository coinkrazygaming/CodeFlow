import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Github, 
  Bot, 
  Zap, 
  Globe, 
  BarChart3, 
  Shield,
  Code,
  Rocket,
  Sparkles,
  CheckCircle,
  Star
} from "lucide-react";
import { useSession } from "@/components/providers/auth-provider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AIDevelopmentEnvironment } from "@/components/ai-workspace/ai-development-environment";

export default function Index() {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const [showAIWorkspace, setShowAIWorkspace] = useState(false);

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  if (session) {
    return null; // Will redirect to dashboard
  }

  // Show AI workspace if user wants to start building
  if (showAIWorkspace) {
    return <AIDevelopmentEnvironment />;
  }

  const features = [
    {
      icon: Bot,
      title: "Josey AI Assistant",
      description: "Step-by-step coding help, debugging, and full app generation from prompts"
    },
    {
      icon: Code,
      title: "Visual Editor + Monaco",
      description: "Drag-and-drop interface synced with professional code editor"
    },
    {
      icon: Rocket,
      title: "One-Click Deployment",
      description: "Deploy to production with Preview → Build → Production pipeline"
    },
    {
      icon: Github,
      title: "GitHub Integration",
      description: "Import repos, create pull requests, and sync code seamlessly"
    },
    {
      icon: Globe,
      title: "Custom Domains",
      description: "Professional domains with clean8.online integration"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track performance, usage, and user engagement"
    }
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "1 project",
        "25 AI edits",
        "Community support",
        "Basic analytics"
      ],
      button: "Start Free",
      popular: false
    },
    {
      name: "Premium",
      price: "$29",
      description: "For serious developers",
      features: [
        "Unlimited projects",
        "1,000 AI edits",
        "Priority support",
        "Advanced analytics",
        "Custom domains",
        "Team collaboration"
      ],
      button: "Start Premium",
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-background to-brand-50" />
        <div className="relative container py-20 lg:py-32">
          <div className="text-center space-y-8">
            <Badge variant="secondary" className="px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Powered by AI
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Build & Deploy with
              <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                {" "}AI Assistance
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              CodeFlow AI is the complete platform for building, deploying, and scaling applications. 
              Get step-by-step coding help from Josey AI, manage your projects, and deploy with one click.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => setShowAIWorkspace(true)}>
                Start Building Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/auth/signin')}>
                Sign In
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Free trial
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                No credit card
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                25 AI edits included
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything you need to build faster
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From idea to deployment, CodeFlow AI provides all the tools and AI assistance 
              you need to build professional applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="h-12 w-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Start free, upgrade when you need more power
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.popular ? 'border-brand-500 shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-brand-500 to-brand-700">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => navigate('/auth/signin')}
                  >
                    {plan.button}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-brand-500 to-brand-700 text-white">
        <div className="container text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to build your next project?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of developers using CodeFlow AI to build faster with AI assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/auth/signin')}>
              Start Building Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-700">
              Talk to Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700" />
              <span className="text-xl font-bold">CodeFlow AI</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="/privacy" className="hover:text-foreground">Privacy Policy</a>
              <a href="/terms" className="hover:text-foreground">Terms of Service</a>
              <a href="/support" className="hover:text-foreground">Support</a>
              <a href="https://github.com" className="hover:text-foreground">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 CodeFlow AI. All rights reserved. Powered by clean8.online
          </div>
        </div>
      </footer>
    </div>
  );
}
