import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST() {
  try {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) throw new Error('STRIPE_SECRET_KEY is not set');

    const stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16',
    });

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5900, // $59.00 in cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error('Error creating payment intent:', err);
    return NextResponse.json(
      { error: 'Error creating payment intent' },
      { status: 500 }
    );
  }
}
