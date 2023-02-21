//@ts-check
const fs = require('fs');
const path = require('path');

const localPath = path.resolve('./public/locales');
const monorepoPath = path.resolve('./apps/adventials/public/locales');

const isLocalPath = fs.existsSync(localPath);
const isMonorepoPath = fs.existsSync(monorepoPath);

let i18nPath;

if (isLocalPath) {
  i18nPath = localPath;
} else if (isMonorepoPath) {
  i18nPath = monorepoPath;
} else {
  throw new Error(`Path doesn't exist ${localPath}`);
}

module.exports = {
  i18n: {
    locales: ['en-US', 'de'],
    defaultLocale: 'en-US',
  },
  localePath: i18nPath,
};
