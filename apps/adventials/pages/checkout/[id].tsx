import { withSentryGetServerSideProps } from '@sentry/nextjs';
import { GetServerSideProps } from 'next';
import CheckoutApproval from '../../components/checkout/checkout-approval';
import { getTranslations } from '../../get-translations';
import styles from './[id].module.scss';

/* eslint-disable-next-line */
export interface CheckoutIdProps {
  transactionId: string;
}

export function CheckoutId(props: CheckoutIdProps) {
  return (
    <div className={styles['checkout-id-page']}>
      <CheckoutApproval transactionId={props.transactionId} />
    </div>
  );
}

export const getServerSideProps = withSentryGetServerSideProps(
  (async (context) => {
    if (!context.locale) {
      throw new Error('Locale is undefined');
    }

    const transactionId = context.params?.['id']?.toString();
    if (!transactionId) {
      throw new Error('transactionId is undefined');
    }

    return {
      props: {
        ...(await getTranslations(context.locale)),
        transactionId,
      },
    };
  }) as GetServerSideProps<CheckoutIdProps>,
  '/checkout/[id]'
);

export default CheckoutId;
