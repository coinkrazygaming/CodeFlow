import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const getStripeProducts = async () => {
  try {
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });
    return products.data;
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    return [];
  }
};

export const createCheckoutSession = async (
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) => {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const createCustomerPortalSession = async (
  customerId: string,
  returnUrl: string
) => {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return session;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

export const getCustomerSubscriptions = async (customerId: string) => {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      expand: ['data.default_payment_method', 'data.items.data.price.product'],
    });
    return subscriptions.data;
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return [];
  }
};

export const createOrUpdateCustomer = async (
  email: string,
  name: string,
  userId: string
) => {
  try {
    // First try to find existing customer
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      const customer = existingCustomers.data[0];
      // Update existing customer
      return await stripe.customers.update(customer.id, {
        name,
        metadata: { userId },
      });
    }

    // Create new customer
    return await stripe.customers.create({
      email,
      name,
      metadata: { userId },
    });
  } catch (error) {
    console.error('Error creating/updating customer:', error);
    throw error;
  }
};

export const handleWebhook = async (
  body: Buffer,
  signature: string
): Promise<Stripe.Event> => {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    return event;
  } catch (error) {
    console.error('Webhook error:', error);
    throw new Error('Invalid webhook signature');
  }
};

// Plan configurations
export const plans = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '1 project',
      '25 AI edits per month',
      'Community support',
      'Basic analytics',
    ],
    limits: {
      projects: 1,
      aiEdits: 25,
      customDomains: 0,
      teamMembers: 1,
    },
  },
  premium: {
    name: 'Premium',
    price: 29,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: [
      'Unlimited projects',
      '1,000 AI edits per month',
      'Priority support',
      'Advanced analytics',
      'Custom domains',
      'Team collaboration',
      'GitHub integration',
      'Deployment automation',
    ],
    limits: {
      projects: -1, // unlimited
      aiEdits: 1000,
      customDomains: 10,
      teamMembers: 5,
    },
  },
};
