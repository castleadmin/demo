import { Box, Button, Paper, Typography } from '@mui/material';
import { Trans } from 'next-i18next';
import Link from 'next/link';
import styles from './footer.module.scss';

/* eslint-disable-next-line */
export interface FooterProps {}

export function Footer(_props: FooterProps) {
  return (
    <Box
      sx={{ bgcolor: 'primary.main', position: 'relative', zIndex: 'appBar' }}
    >
      <footer className={styles['footer'] as string}>
        <Paper className={styles['container'] as string} square>
          <div>
            <Typography
              className={styles['footer-first-line'] as string}
              variant="body2"
              align="center"
              color="white"
              sx={{
                fontSize: '0.75rem',
              }}
            >
              <Trans>about</Trans>
            </Typography>
            <div className={styles['footer-second-line']}>
              <Link
                className={styles['link']}
                href={{ pathname: '/privacy-policy', query: {} }}
                rel="noreferrer noopener"
                target="_blank"
              >
                <Button
                  size="small"
                  color="footerButton"
                  sx={{
                    mr: 0.5,
                    fontSize: '0.75rem',
                    fontWeight: '400',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <Trans>privacyPolicy</Trans>
                </Button>
              </Link>
              <Link
                className={styles['link']}
                href={{ pathname: '/references', query: {} }}
                rel="noreferrer noopener"
                target="_blank"
              >
                <Button
                  size="small"
                  color="footerButton"
                  sx={{
                    ml: 0.5,
                    fontSize: '0.75rem',
                    fontWeight: '400',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <Trans>references</Trans>
                </Button>
              </Link>
            </div>
          </div>
        </Paper>
      </footer>
    </Box>
  );
}

export default Footer;
