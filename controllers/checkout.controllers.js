const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (items, amount) => {
  const customer = await stripe.customers.create();

  const paymentIntent = await stripe.paymentIntents.create({
    customer: customer.id,
    setup_future_usage: 'off_session',
    amount: amount,
    currency: 'rwf',
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
};

const getClientSecret = async (req, res, next) => {
  const { items, amount } = req.body;
  try {
    const paymentIntent = await createPaymentIntent(items, amount);
    res.status(200).json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};

module.exports = {
  getClientSecret
};
