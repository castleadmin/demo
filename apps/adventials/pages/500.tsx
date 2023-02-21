import { withSentryGetStaticProps } from '@sentry/nextjs';
import { GetStaticProps } from 'next';
import NextErrorComponent from 'next/error';
import { getTranslations } from '../get-translations';

const Error500 = () => {
  return <NextErrorComponent statusCode={500} />;
};

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
  '/500'
);

export default Error500;
