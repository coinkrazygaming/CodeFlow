import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Navbar } from '@/components/dashboard/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Copy, 
  Share2,
  Award,
  Calendar,
  Download,
  ExternalLink,
  Gift,
  Target,
  Wallet
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

type Mode = 'preview' | 'dev' | 'build' | 'production';

interface ReferralData {
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  totalReferrals: number;
  activeReferrals: number;
  conversionRate: number;
  currentTier: string;
  nextTierProgress: number;
  referralCode: string;
}

interface Referral {
  id: string;
  referredUser: string;
  signupDate: Date;
  status: 'pending' | 'confirmed' | 'converted';
  commissionEarned: number;
  subscriptionTier: string;
}

interface Payout {
  id: string;
  amount: number;
  status: 'pending' | 'processed' | 'completed';
  requestDate: Date;
  processedDate?: Date;
  method: string;
}

export default function ReferralsPage() {
  const [currentMode, setCurrentMode] = useState<Mode>('preview');
  const [referralData, setReferralData] = useState<ReferralData>({
    totalEarnings: 0,
    pendingEarnings: 0,
    paidEarnings: 0,
    totalReferrals: 0,
    activeReferrals: 0,
    conversionRate: 0,
    currentTier: 'Bronze',
    nextTierProgress: 0,
    referralCode: ''
  });
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const [dataResponse, referralsResponse, payoutsResponse] = await Promise.all([
        fetch('/api/referrals/stats'),
        fetch('/api/referrals'),
        fetch('/api/referrals/payouts')
      ]);

      const data = await dataResponse.json();
      const referralsData = await referralsResponse.json();
      const payoutsData = await payoutsResponse.json();

      setReferralData(data || mockReferralData);
      setReferrals(referralsData || mockReferrals);
      setPayouts(payoutsData || mockPayouts);
    } catch (error) {
      console.error('Error fetching referral data:', error);
      // Set mock data
      setReferralData(mockReferralData);
      setReferrals(mockReferrals);
      setPayouts(mockPayouts);
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralLink = () => {
    const referralLink = `https://codeflow-ai.com/?ref=${referralData.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Referral link copied!",
      description: "Share this link to start earning commissions."
    });
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralData.referralCode);
    toast({
      title: "Referral code copied!",
      description: "Use this code in your marketing materials."
    });
  };

  const requestPayout = async () => {
    try {
      const response = await fetch('/api/referrals/request-payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        toast({
          title: "Payout requested!",
          description: "Your payout request has been submitted and will be processed within 5-7 business days."
        });
        fetchReferralData();
      }
    } catch (error) {
      console.error('Error requesting payout:', error);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze': return 'bg-orange-500';
      case 'Silver': return 'bg-gray-400';
      case 'Gold': return 'bg-yellow-500';
      case 'Platinum': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': case 'converted': case 'completed': return 'bg-green-500';
      case 'pending': case 'processed': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  // Mock data
  const mockReferralData: ReferralData = {
    totalEarnings: 1247.50,
    pendingEarnings: 342.75,
    paidEarnings: 904.75,
    totalReferrals: 47,
    activeReferrals: 23,
    conversionRate: 48.9,
    currentTier: 'Silver',
    nextTierProgress: 65,
    referralCode: 'CODEFLOW-ABC123'
  };

  const mockReferrals: Referral[] = [
    {
      id: '1',
      referredUser: 'john.doe@example.com',
      signupDate: new Date('2024-01-15'),
      status: 'converted',
      commissionEarned: 29.00,
      subscriptionTier: 'Premium'
    },
    {
      id: '2',
      referredUser: 'sarah.smith@example.com',
      signupDate: new Date('2024-01-12'),
      status: 'confirmed',
      commissionEarned: 0,
      subscriptionTier: 'Free'
    },
    {
      id: '3',
      referredUser: 'mike.wilson@example.com',
      signupDate: new Date('2024-01-10'),
      status: 'pending',
      commissionEarned: 0,
      subscriptionTier: 'Free'
    }
  ];

  const mockPayouts: Payout[] = [
    {
      id: '1',
      amount: 150.00,
      status: 'completed',
      requestDate: new Date('2024-01-01'),
      processedDate: new Date('2024-01-05'),
      method: 'PayPal'
    },
    {
      id: '2',
      amount: 275.50,
      status: 'pending',
      requestDate: new Date('2024-01-15'),
      method: 'Bank Transfer'
    }
  ];

  const tiers = [
    { name: 'Bronze', commission: '10%', requirement: '0 referrals', color: 'bg-orange-500' },
    { name: 'Silver', commission: '15%', requirement: '10 referrals', color: 'bg-gray-400' },
    { name: 'Gold', commission: '20%', requirement: '25 referrals', color: 'bg-yellow-500' },
    { name: 'Platinum', commission: '25%', requirement: '50 referrals', color: 'bg-purple-500' }
  ];

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
            <h1 className="text-3xl font-bold mb-2">Referral Program</h1>
            <p className="text-muted-foreground">
              Earn commissions by referring new users to CodeFlow AI
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="referrals">My Referrals</TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
              <TabsTrigger value="tiers">Commission Tiers</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${referralData.totalEarnings.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">All-time commission earnings</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${referralData.pendingEarnings.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Available for payout</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{referralData.totalReferrals}</div>
                    <p className="text-xs text-muted-foreground">{referralData.activeReferrals} active users</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{referralData.conversionRate}%</div>
                    <p className="text-xs text-muted-foreground">Signup to paid conversion</p>
                  </CardContent>
                </Card>
              </div>

              {/* Current Tier & Referral Links */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Current Tier
                    </CardTitle>
                    <CardDescription>Your current commission tier and progress</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge className={`${getTierColor(referralData.currentTier)} text-white`}>
                        {referralData.currentTier}
                      </Badge>
                      <span className="font-medium">
                        {tiers.find(t => t.name === referralData.currentTier)?.commission} commission rate
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress to next tier</span>
                        <span>{referralData.nextTierProgress}%</span>
                      </div>
                      <Progress value={referralData.nextTierProgress} className="h-2" />
                    </div>

                    <div className="pt-2">
                      <Button 
                        onClick={requestPayout}
                        disabled={referralData.pendingEarnings < 50}
                        className="w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Request Payout (Min. $50)
                      </Button>
                      {referralData.pendingEarnings < 50 && (
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Minimum payout amount is $50.00
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Share2 className="h-5 w-5" />
                      Referral Links
                    </CardTitle>
                    <CardDescription>Share these links to start earning commissions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Referral Code</label>
                      <div className="flex gap-2 mt-1">
                        <Input value={referralData.referralCode} readOnly />
                        <Button variant="outline" onClick={copyReferralCode}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Referral Link</label>
                      <div className="flex gap-2 mt-1">
                        <Input 
                          value={`https://codeflow-ai.com/?ref=${referralData.referralCode}`} 
                          readOnly 
                        />
                        <Button variant="outline" onClick={copyReferralLink}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Twitter
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        LinkedIn
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="referrals" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Referrals</CardTitle>
                  <CardDescription>Track all users you've referred to CodeFlow AI</CardDescription>
                </CardHeader>
                <CardContent>
                  {referrals.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold mb-2">No referrals yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start sharing your referral link to earn commissions
                      </p>
                      <Button onClick={copyReferralLink}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Referral Link
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {referrals.map((referral) => (
                        <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="font-medium">{referral.referredUser}</div>
                              <div className="text-sm text-muted-foreground">
                                Signed up {referral.signupDate.toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <Badge variant="outline">{referral.subscriptionTier}</Badge>
                            <Badge className={`${getStatusColor(referral.status)} text-white`}>
                              {referral.status}
                            </Badge>
                            <div className="text-right">
                              <div className="font-medium">${referral.commissionEarned.toFixed(2)}</div>
                              <div className="text-sm text-muted-foreground">Commission</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payouts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payout History</CardTitle>
                  <CardDescription>Track your commission payouts and requests</CardDescription>
                </CardHeader>
                <CardContent>
                  {payouts.length === 0 ? (
                    <div className="text-center py-12">
                      <Wallet className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold mb-2">No payouts yet</h3>
                      <p className="text-muted-foreground">
                        Your payout history will appear here once you request payouts
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {payouts.map((payout) => (
                        <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">${payout.amount.toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">
                              Requested {payout.requestDate.toLocaleDateString()} via {payout.method}
                            </div>
                            {payout.processedDate && (
                              <div className="text-sm text-muted-foreground">
                                Processed {payout.processedDate.toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          
                          <Badge className={`${getStatusColor(payout.status)} text-white`}>
                            {payout.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tiers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Commission Tiers</CardTitle>
                  <CardDescription>Earn higher commissions as you refer more users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {tiers.map((tier) => (
                      <Card key={tier.name} className={`relative ${tier.name === referralData.currentTier ? 'ring-2 ring-brand-500' : ''}`}>
                        <CardContent className="p-6 text-center">
                          <div className={`h-12 w-12 rounded-full ${tier.color} mx-auto mb-4 flex items-center justify-center`}>
                            <Award className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{tier.name}</h3>
                          <div className="text-2xl font-bold mb-2">{tier.commission}</div>
                          <p className="text-sm text-muted-foreground">{tier.requirement}</p>
                          {tier.name === referralData.currentTier && (
                            <Badge className="mt-3">Current Tier</Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-6 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-3">How it works:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Earn commission when referred users upgrade to Premium ($29/month)</li>
                      <li>• Commission rates increase with more successful referrals</li>
                      <li>• Minimum payout threshold is $50</li>
                      <li>• Payouts are processed within 5-7 business days</li>
                      <li>• Track your progress in real-time</li>
                    </ul>
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
