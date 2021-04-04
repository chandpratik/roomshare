import stripe from 'stripe';

const client = new stripe(`${process.env.S_SECRET_KEY}`);

export const Stripe = {
  connect: async (code: string) => {
    /* eslint-disable @typescript-eslint/camelcase */
    const response = await client.oauth.token({
      grant_type: 'authorization_code',
      code,
      /* eslint-enable @typescript-eslint/camelcase */
    });

    return response;
  },
  charge: async (amount: number, source: string, stripeAccount: string) => {
    const res = await client.charges.create(
      {
        amount,
        currency: 'usd',
        source,
        application_fee_amount: Math.round(amount * 0.5),
      },
      {
        stripe_account: stripeAccount,
      }
    );

    if (res.status !== 'succeeded') {
      throw new Error('failed to create charge with stripe');
    }
  },
};
