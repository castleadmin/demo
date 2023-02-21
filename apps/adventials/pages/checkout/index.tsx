import { withSentryGetStaticProps } from '@sentry/nextjs';
import { GetStaticProps } from 'next';
import CheckoutForm from '../../components/checkout/checkout-form';
import { getTranslations } from '../../get-translations';
import styles from './index.module.scss';

/* eslint-disable-next-line */
export interface CheckoutProps {}

export function Checkout(_props: CheckoutProps) {
  return (
    <div className={styles['checkout-page']}>
      <CheckoutForm />
    </div>
  );
}

export const getStaticProps: GetStaticProps = withSentryGetStaticProps(
  (async (context) => {
    if (!context.locale) {
      throw new Error('Locale is undefined');
    }

    return {
      props: {
        ...(await getTranslations(context.locale)),
      },
    };
  }) as GetStaticProps,
  '/checkout'
);

export default Checkout;
