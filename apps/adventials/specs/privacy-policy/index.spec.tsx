import { render } from '@testing-library/react';
import 'next-i18next';
import PrivacyPolicy, {
  getStaticProps,
} from '../../pages/privacy-policy/index';

jest.mock('next-i18next', () => ({
  Trans: (props) => <span>{props.children}</span>,
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => undefined),
      },
    };
  },
}));

describe('PrivacyPolicy', () => {
  it('Should render successfully', () => {
    const { baseElement } = render(<PrivacyPolicy />);
    expect(baseElement).toBeTruthy();
  });

  it('Should execute getStaticProps successfully', async () => {
    const result = getStaticProps({ locale: 'en-US' });
    await expect(result).resolves.toBeTruthy();
  });

  it('getStaticProps should throw an error if the locale is undefined', async () => {
    await expect(getStaticProps({})).rejects.toBeInstanceOf(Error);
  });
});
