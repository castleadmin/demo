import { withSentryGetStaticProps } from '@sentry/nextjs';
import { GetStaticProps } from 'next';
import NextErrorComponent from 'next/error';
import { getTranslations } from '../get-translations';

const Error404 = () => {
  return <NextErrorComponent statusCode={404} />;
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
  '/404'
);

export default Error404;
