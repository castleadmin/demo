//@ts-check
const path = require('path');
const { withNx } = require('@nrwl/next/plugins/with-nx');
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const { withSentryConfig } = require('@sentry/nextjs');
const release = process.env['SENTRY_RELEASE'];
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env['ANALYZE'] === 'true',
});
const { i18n } = require('./next-i18next.config');

module.exports = (phase) => {
  const contentSecurityPolicy = `
    default-src 'self';
    connect-src https://vitals.vercel-insights.com PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER 'self';
    style-src https://fonts.googleapis.com 'self' 'unsafe-inline';
    font-src https://fonts.googleapis.com https://fonts.gstatic.com;
    script-src 'self';
  `;

  const contentSecurityPolicyDevelopment = `
    default-src 'self';
    connect-src https://vitals.vercel-insights.com PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER 'self';
    style-src https://fonts.googleapis.com 'self' 'unsafe-inline';
    font-src https://fonts.googleapis.com https://fonts.gstatic.com;
    script-src 'self' 'unsafe-eval';
  `;

  const createSecurityHeaders = (phase) => {
    return [
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'origin-when-cross-origin',
      },
      {
        key: 'Content-Security-Policy',
        value:
          phase === PHASE_DEVELOPMENT_SERVER
            ? contentSecurityPolicyDevelopment.replace(/\s{2,}/g, ' ').trim()
            : contentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
      },
    ];
  };

  /**
   * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
   **/
  const nextConfig = {
    async headers() {
      return [
        {
          source: '/:path*',
          headers: createSecurityHeaders(phase),
        },
      ];
    },
    i18n,
    generateEtags: true,
    compress: true,
    poweredByHeader: false,
    reactStrictMode: true,
    nx: {
      svgr: false,
    },
    sentry: {
      autoInstrumentServerFunctions: false,
      disableServerWebpackPlugin: !release,
      disableClientWebpackPlugin: !release,
      hideSourceMaps: true,
    },
  };

  const sentryWebpackPluginOptions = {
    url: 'https://sentry.io/',
    org: 'castleadmin',
    project: 'adventials',
    release: release ?? 'development',

    include: [
      {
        paths: [
          path.resolve(
            __dirname,
            '../../dist/apps/adventials/.next/static/chunks/pages'
          ),
        ],
        urlPrefix: '~/_next/static/chunks/pages',
      },
      {
        paths: [
          path.resolve(
            __dirname,
            '../../dist/apps/adventials/.next/server/pages'
          ),
        ],
        urlPrefix: '~/_next/server/pages',
      },
      {
        paths: [
          path.resolve(
            __dirname,
            '../../dist/apps/adventials/.next/server/chunks'
          ),
        ],
        urlPrefix: '~/_next/server/chunks',
      },
    ],
  };

  const sentryNextConfig = withSentryConfig(
    withNx(nextConfig),
    sentryWebpackPluginOptions
  );

  if (typeof sentryNextConfig !== 'function') {
    throw new Error("Sentry config isn't a function");
  }

  const composedNextConfig = withBundleAnalyzer(
    sentryNextConfig(phase, { defaultConfig: {} })
  );

  return composedNextConfig;
};
