//@ts-check
const path = require('path');
const slsw = require('serverless-webpack');
const SentryPlugin = require('@sentry/webpack-plugin');
const release = process.env['SENTRY_RELEASE'];

module.exports = {
  entry: slsw.lib.entries,
  externals: ['@sentry/serverless', 'aws4', 'mongodb'],
  target: 'node',
  devtool: 'hidden-source-map',
  mode: slsw.lib.options.stage === 'test' ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ],
  },
  plugins: [
    new SentryPlugin({
      runOnce: true,
      url: 'https://sentry.io/',
      org: 'castleadmin',
      project: 'checkout-service',
      release: release ?? 'development',

      urlPrefix: '/var/task/',
      include: Object.keys(slsw.lib.entries).map((handlerName) =>
        path.resolve(__dirname, '.webpack', handlerName)
      ),
      ignore: ['node_modules'],
    }),
  ],
};
