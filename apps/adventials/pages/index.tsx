import { Typography } from '@mui/material';
import { withSentryGetStaticProps } from '@sentry/nextjs';
import { GetStaticProps } from 'next';
import Categories from '../components/index/categories';
import { getTranslations } from '../get-translations';
import styles from './index.module.scss';

export function Index() {
  return (
    <div className={styles['home-page']}>
      <Typography
        className={styles['title'] as string}
        variant="h1"
        align="center"
        color="#212121"
      >
        Adventials
      </Typography>
      <Typography
        className={styles['subtitle'] as string}
        variant="h3"
        align="center"
        color="text.secondary"
      >
        Adventure Essentials
      </Typography>
      <div className={styles['categories']}>
        <Categories />
      </div>
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
  '/'
);

export default Index;
