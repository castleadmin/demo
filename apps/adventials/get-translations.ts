import { SSRConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import * as i18nConfig from './next-i18next.config';

export async function getTranslations(locale: string): Promise<SSRConfig> {
  return serverSideTranslations(locale, ['common'], i18nConfig);
}
