import { useState, useEffect } from 'react';
import { useSession } from '@/components/providers/auth-provider';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Navbar } from '@/components/dashboard/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Star, 
  CheckCircle, 
  ArrowUpCircle, 
  Calendar,
  DollarSign,
  TrendingUp,
  Download
} from 'lucide-react';

type Mode = 'preview' | 'dev' | 'build' | 'production';

interface Subscription {
  id: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  items: {
    data: Array<{
      price: {
        id: string;
        unit_amount: number;
        currency: string;
        product: {
          name: string;
        };
      };
    }>;
  };
}

interface Usage {
  aiEdits: number;
  projects: number;
  customDomains: number;
  teamMembers: number;
}

export default function BillingPage() {
  const { data: session } = useSession();
  const [currentMode, setCurrentMode] = useState<Mode>('preview');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<Usage>({
    aiEdits: 0,
    projects: 0,
    customDomains: 0,
    teamMembers: 1
  });
  const [isLoading, setIsLoading] = useState(true);

  const isPremium = session?.user?.subscription_tier === 'premium';

  useEffect(() => {
    fetchBillingData();
    fetchUsage();
  }, []);

  const fetchBillingData = async () => {
    try {
      const response = await fetch('/api/billing/subscription');
      const data = await response.json();
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/billing/usage');
      const data = await response.json();
      setUsage(data);
    } catch (error) {
      console.error('Error fetching usage:', error);
    }
  };

  const handleUpgrade = async () => {
    try {
      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
          successUrl: window.location.origin + '/dashboard/billing?success=true',
          cancelUrl: window.location.origin + '/dashboard/billing?cancelled=true'
        })
      });
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/billing/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          returnUrl: window.location.origin + '/dashboard/billing'
        })
      });
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating portal session:', error);
    }
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '1 project',
        '25 AI edits per month',
        'Community support',
        'Basic analytics'
      ],
      limits: {
        projects: 1,
        aiEdits: 25,
        customDomains: 0,
        teamMembers: 1
      },
      current: !isPremium,
      buttonText: 'Current Plan',
      buttonDisabled: true
    },
    {
      name: 'Premium',
      price: '$29',
      period: 'per month',
      description: 'For serious developers',
      features: [
        'Unlimited projects',
        '1,000 AI edits per month',
        'Priority support',
        'Advanced analytics',
        'Custom domains',
        'Team collaboration',
        'GitHub integration',
        'Deployment automation'
      ],
      limits: {
        projects: -1,
        aiEdits: 1000,
        customDomains: 10,
        teamMembers: 5
      },
      current: isPremium,
      buttonText: isPremium ? 'Manage Subscription' : 'Upgrade to Premium',
      buttonDisabled: false,
      popular: true
    }
  ];

  const currentPlan = plans.find(p => p.current) || plans[0];
  const aiEditsPercentage = (usage.aiEdits / currentPlan.limits.aiEdits) * 100;

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
        
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
            <p className="text-muted-foreground">
              Manage your subscription and monitor your usage
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Plan & Usage */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Plan */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Current Plan
                      </CardTitle>
                      <CardDescription>Your current subscription details</CardDescription>
                    </div>
                    <Badge variant={isPremium ? 'default' : 'secondary'} className="gap-1">
                      {isPremium && <Star className="h-3 w-3" />}
                      {currentPlan.name}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{currentPlan.price}</span>
                    <span className="text-muted-foreground">{currentPlan.period}</span>
                  </div>
                  
                  {subscription && (
                    <div className="text-sm text-muted-foreground">
                      {subscription.cancel_at_period_end ? (
                        <div className="flex items-center gap-2 text-amber-600">
                          <Calendar className="h-4 w-4" />
                          Cancels on {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Renews on {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-4">
                    {isPremium ? (
                      <Button onClick={handleManageSubscription} className="w-full">
                        Manage Subscription
                      </Button>
                    ) : (
                      <Button onClick={handleUpgrade} className="w-full">
                        <ArrowUpCircle className="h-4 w-4 mr-2" />
                        Upgrade to Premium
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Usage Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Usage This Month
                  </CardTitle>
                  <CardDescription>Monitor your current usage against plan limits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">AI Edits</span>
                      <span className="text-sm text-muted-foreground">
                        {usage.aiEdits} / {currentPlan.limits.aiEdits === -1 ? '∞' : currentPlan.limits.aiEdits}
                      </span>
                    </div>
                    <Progress 
                      value={currentPlan.limits.aiEdits === -1 ? 10 : aiEditsPercentage} 
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Projects</span>
                      <span className="text-sm text-muted-foreground">
                        {usage.projects} / {currentPlan.limits.projects === -1 ? '∞' : currentPlan.limits.projects}
                      </span>
                    </div>
                    <Progress 
                      value={currentPlan.limits.projects === -1 ? 20 : (usage.projects / currentPlan.limits.projects) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Custom Domains</span>
                      <span className="text-sm text-muted-foreground">
                        {usage.customDomains} / {currentPlan.limits.customDomains === -1 ? '∞' : currentPlan.limits.customDomains}
                      </span>
                    </div>
                    <Progress 
                      value={currentPlan.limits.customDomains === 0 ? 0 : currentPlan.limits.customDomains === -1 ? 15 : (usage.customDomains / currentPlan.limits.customDomains) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Team Members</span>
                      <span className="text-sm text-muted-foreground">
                        {usage.teamMembers} / {currentPlan.limits.teamMembers === -1 ? '∞' : currentPlan.limits.teamMembers}
                      </span>
                    </div>
                    <Progress 
                      value={currentPlan.limits.teamMembers === -1 ? 25 : (usage.teamMembers / currentPlan.limits.teamMembers) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Plan Comparison */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Plans</CardTitle>
                  <CardDescription>Choose the plan that fits your needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {plans.map((plan) => (
                      <Card key={plan.name} className={`relative ${plan.popular ? 'border-brand-500' : ''}`}>
                        {plan.popular && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-brand-500">
                              <Star className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          </div>
                        )}
                        
                        <CardContent className="p-4">
                          <div className="text-center space-y-2">
                            <h3 className="font-semibold">{plan.name}</h3>
                            <div className="text-2xl font-bold">{plan.price}</div>
                            <p className="text-xs text-muted-foreground">{plan.period}</p>
                            <p className="text-sm text-muted-foreground">{plan.description}</p>
                          </div>

                          <ul className="space-y-2 my-4">
                            {plan.features.slice(0, 4).map((feature) => (
                              <li key={feature} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>

                          <Button 
                            className="w-full" 
                            variant={plan.current ? "outline" : "default"}
                            disabled={plan.buttonDisabled}
                            onClick={plan.current && isPremium ? handleManageSubscription : handleUpgrade}
                          >
                            {plan.buttonText}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Billing Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Billing Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={handleManageSubscription}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Update Payment Method
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoices
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Billing History
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
