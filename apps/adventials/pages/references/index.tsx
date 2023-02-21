import { Card, CardContent } from '@mui/material';
import { withSentryGetStaticProps } from '@sentry/nextjs';
import { GetStaticProps } from 'next';
import { Trans } from 'next-i18next';
import { getTranslations } from '../../get-translations';
import styles from './index.module.scss';

/* eslint-disable-next-line */
export interface ReferencesProps {}

export function References(_props: ReferencesProps) {
  return (
    <div className={styles['references-page']}>
      <Card sx={{ bgcolor: 'menu.main', boxShadow: 4 }}>
        <CardContent>
          <h1 className={styles['references-title'] as string}>
            <Trans>references</Trans>
          </h1>
          <div className={styles['references']}>
            <ul>
              <li>
                <p>
                  <a
                    href="http://opengameart.org/content/fantasy-icon-pack-by-ravenmore-0"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    Fantasy Icon Pack by Ravenmore{' '}
                  </a>
                  <a
                    href="https://creativecommons.org/licenses/by/3.0/"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    (CC BY 3.0)
                  </a>
                </p>
              </li>
              <li>
                <p>
                  <a
                    href="http://opengameart.org/content/painterly-spell-icons-part-1"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    Painterly Spell Icons Part 1
                  </a>
                  <a
                    href="https://creativecommons.org/licenses/by/3.0/"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    (CC BY 3.0)
                  </a>
                </p>
              </li>
              <li>
                <p>
                  <a
                    href="http://opengameart.org/content/painterly-spell-icons-part-2"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    Painterly Spell Icons Part 2
                  </a>
                  <a
                    href="https://creativecommons.org/licenses/by/3.0/"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    (CC BY 3.0)
                  </a>
                </p>
              </li>
              <li>
                <p>
                  <a
                    href="http://opengameart.org/content/painterly-spell-icons-part-3"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    Painterly Spell Icons Part 3
                  </a>
                  <a
                    href="https://creativecommons.org/licenses/by/3.0/"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    (CC BY 3.0)
                  </a>
                </p>
              </li>
              <li>
                <p>
                  <a
                    href="http://opengameart.org/content/painterly-spell-icons-part-4"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    Painterly Spell Icons Part 4
                  </a>
                  <a
                    href="https://creativecommons.org/licenses/by/3.0/"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    (CC BY 3.0)
                  </a>
                </p>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
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
  '/references'
);

export default References;
