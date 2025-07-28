import { RequestHandler } from 'express';
import { 
  createCheckoutSession, 
  createCustomerPortalSession, 
  getCustomerSubscriptions,
  createOrUpdateCustomer,
  handleWebhook
} from '../../lib/stripe';
import { supabaseAdmin } from '../../lib/database';

export const createCheckoutSessionHandler: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers.authorization?.replace('Bearer ', '');
    const { priceId, successUrl, cancelUrl } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user details
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create or get Stripe customer
    const customer = await createOrUpdateCustomer(
      user.email,
      user.name,
      userId
    );

    // Create checkout session
    const session = await createCheckoutSession(
      customer.id,
      priceId,
      successUrl,
      cancelUrl
    );

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

export const createPortalSessionHandler: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers.authorization?.replace('Bearer ', '');
    const { returnUrl } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user details
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get or create Stripe customer
    const customer = await createOrUpdateCustomer(
      user.email,
      user.name,
      userId
    );

    // Create portal session
    const session = await createCustomerPortalSession(
      customer.id,
      returnUrl
    );

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
};

export const getSubscriptionHandler: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers.authorization?.replace('Bearer ', '');

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user details
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get customer subscriptions
    const customer = await createOrUpdateCustomer(
      user.email,
      user.name,
      userId
    );

    const subscriptions = await getCustomerSubscriptions(customer.id);
    const activeSubscription = subscriptions.find(sub => 
      ['active', 'trialing'].includes(sub.status)
    );

    res.json(activeSubscription || null);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
};

export const getUsageHandler: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers.authorization?.replace('Bearer ', '');

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get current month's usage
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      { count: aiEditsCount },
      { count: projectsCount },
      { count: domainsCount }
    ] = await Promise.all([
      supabaseAdmin
        .from('ai_edits')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString()),
      
      supabaseAdmin
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
      
      supabaseAdmin
        .from('domains')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
    ]);

    res.json({
      aiEdits: aiEditsCount || 0,
      projects: projectsCount || 0,
      customDomains: domainsCount || 0,
      teamMembers: 1 // TODO: Implement team members
    });
  } catch (error) {
    console.error('Error fetching usage:', error);
    res.status(500).json({ error: 'Failed to fetch usage' });
  }
};

export const webhookHandler: RequestHandler = async (req, res) => {
  const signature = req.headers['stripe-signature'] as string;
  
  try {
    const event = await handleWebhook(req.body, signature);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;

        // Update user subscription status
        if (subscription.status === 'active') {
          await supabaseAdmin
            .from('users')
            .update({ 
              subscription_tier: 'premium',
              ai_edits_used: 0 // Reset AI edits on subscription activation
            })
            .eq('stripe_customer_id', customerId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;

        // Downgrade user to free tier
        await supabaseAdmin
          .from('users')
          .update({ subscription_tier: 'free' })
          .eq('stripe_customer_id', customerId);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        // Log successful payment
        console.log('Payment succeeded for invoice:', invoice.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        // Handle failed payment
        console.log('Payment failed for invoice:', invoice.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
};
