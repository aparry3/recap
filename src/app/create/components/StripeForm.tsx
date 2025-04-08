'use client';

import React, { FC, useEffect, useState } from 'react';
import { Column, Container, Form, Row, Text } from 'react-web-layout-components';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import styles from './StripeForm.module.scss';
import Button from '@/components/Button';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { leftIcon } from '@/lib/icons';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface CheckoutFormProps {
  onSuccess: () => void;
}

const CheckoutForm: FC<CheckoutFormProps> = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/create?success=true`,
        },
        redirect: 'if_required',
      });

      if (submitError) {
        setError(submitError.message || 'An error occurred');
      } else {
        onSuccess();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
        <Column className={styles.content}>
          <Container className={styles.section}>
            <Text size={1}>Please enter your payment details to create your gallery.</Text>
          </Container>
          <Form onSubmit={handleSubmit} className={styles.form}>
            {/* <ExpressCheckoutElement onConfirm={handleSubmit} /> */}
            <PaymentElement />
            <Container className={styles.submitButtonContainer}>
              <Button 
                className={styles.submitButton} 
                type="submit" 
                disabled={!stripe || loading}
              >
                <Text size={1.1} weight={500}>
                  {loading ? 'Processing...' : 'Pay Now - $150'}
                </Text>
              </Button>
            </Container>
          </Form>
        </Column>
  );
};

const StripeForm: FC<StripeFormProps> = ({onCancel, onSuccess}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id: 'gallery-creation' }] }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);


  return (
    <Container as='main' className={styles.page}>
      <Container className={styles.actions} justify='flex-start'>
        <Container className={styles.backButton} onClick={onCancel}>
          <FontAwesomeIcon icon={leftIcon} />
          <Container className={styles.backButtonText}>
            <Text size={1} weight={500}>Back</Text>
          </Container>
        </Container>
      </Container>
      <Column className={styles.titleContainer}>
        <Row as='header' padding={1}>
          <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
        </Row>
        <Column as='header' className={styles.header}>
          <Text size={1.4}>Complete Your</Text>
          <Text size={2.5} weight={500}>Payment</Text>
        </Column>
      </Column>
      <Container className={styles.contentContainer}>
        <Column className={styles.content}>
        { clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm onSuccess={onSuccess} />
          </Elements>
        ) : (
          <>
            <Column as='header' className={styles.header}>
              <Text size={1.4}>Loading</Text>
              <Text size={2.5} weight={500}>Payment Form</Text>
            </Column>
            <Container className={styles.section}>
              <Text size={1}>Please wait while we prepare your payment form...</Text>
            </Container>
          </>
        )}
        </Column>
      </Container>
    </Container>
  );
};

export default StripeForm; 