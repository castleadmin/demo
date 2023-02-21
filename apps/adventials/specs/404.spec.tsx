import { render } from '@testing-library/react';
import 'next-i18next';
import Error404, { getStaticProps } from '../pages/404';

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

describe('404', () => {
  it('Should render successfully', () => {
    const { baseElement } = render(<Error404 />);
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
