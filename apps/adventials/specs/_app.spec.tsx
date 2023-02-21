import { act, render } from '@testing-library/react';
import 'next-i18next';
import { Router } from 'next/router';
import App, { stateAdventialsApp } from '../pages/_app';
import { mockRouter } from './mocks';

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
  appWithTranslation: (app) => app,
}));

describe('App', () => {
  it('Should render successfully', () => {
    mockRouter();

    const { baseElement } = render(
      <App
        Component={() => {
          return <div></div>;
        }}
        pageProps={{}}
        router={{} as unknown as Router}
      />
    );
    expect(baseElement).toBeTruthy();
  });

  it('Should remove all router events callbacks if the app is unmounted', async () => {
    const callbacks = {};

    mockRouter({
      callbacks,
    });

    const { baseElement, unmount } = render(
      <App
        Component={() => {
          return <div></div>;
        }}
        pageProps={{}}
        router={{} as unknown as Router}
      />
    );

    expect(baseElement).toBeTruthy();
    expect(Object.keys(callbacks).length).toBe(3);

    await act(() => unmount());

    expect(Object.keys(callbacks).length).toBe(0);
  });

  it("Shouldn't change the state if it isn't an items route", () => {
    const callbacks = {};

    mockRouter({
      callbacks,
    });

    const { baseElement } = render(
      <App
        Component={() => {
          return <div></div>;
        }}
        pageProps={{}}
        router={{} as unknown as Router}
      />
    );

    expect(baseElement).toBeTruthy();
    expect(stateAdventialsApp).toEqual({
      isItemsRouteChange: false,
      isItemsIdRouteChange: false,
    });

    act(() =>
      callbacks['routeChangeStart']('https://www.adventials.com/checkout')
    );

    expect(stateAdventialsApp).toEqual({
      isItemsRouteChange: false,
      isItemsIdRouteChange: false,
    });
  });

  describe('isItemsRouteChange', () => {
    it('Should set the isItemsRouteChange state to true if the path ends without a slash', () => {
      const callbacks = {};

      mockRouter({
        callbacks,
      });

      const { baseElement } = render(
        <App
          Component={() => {
            return <div></div>;
          }}
          pageProps={{}}
          router={{} as unknown as Router}
        />
      );

      expect(baseElement).toBeTruthy();
      expect(stateAdventialsApp).toEqual({
        isItemsRouteChange: false,
        isItemsIdRouteChange: false,
      });

      act(() =>
        callbacks['routeChangeStart'](
          'https://www.adventials.com/items?category=shields&sort=popularity&page=1'
        )
      );

      expect(stateAdventialsApp).toEqual({
        isItemsRouteChange: true,
        isItemsIdRouteChange: false,
      });
    });

    it('Should set the isItemsRouteChange state to true if the path ends with a slash', () => {
      const callbacks = {};

      mockRouter({
        callbacks,
      });

      const { baseElement } = render(
        <App
          Component={() => {
            return <div></div>;
          }}
          pageProps={{}}
          router={{} as unknown as Router}
        />
      );

      expect(baseElement).toBeTruthy();
      expect(stateAdventialsApp).toEqual({
        isItemsRouteChange: false,
        isItemsIdRouteChange: false,
      });

      act(() =>
        callbacks['routeChangeStart'](
          'https://www.adventials.com/items/?category=shields&sort=popularity&page=1'
        )
      );

      expect(stateAdventialsApp).toEqual({
        isItemsRouteChange: true,
        isItemsIdRouteChange: false,
      });
    });

    it('Should set the isItemsRouteChange state to false on completion', () => {
      const callbacks = {};

      mockRouter({
        callbacks,
      });

      const { baseElement } = render(
        <App
          Component={() => {
            return <div></div>;
          }}
          pageProps={{}}
          router={{} as unknown as Router}
        />
      );

      expect(baseElement).toBeTruthy();
      expect(stateAdventialsApp).toEqual({
        isItemsRouteChange: false,
        isItemsIdRouteChange: false,
      });

      act(() =>
        callbacks['routeChangeStart'](
          'https://www.adventials.com/items?category=shields&sort=popularity&page=1'
        )
      );

      expect(stateAdventialsApp).toEqual({
        isItemsRouteChange: true,
        isItemsIdRouteChange: false,
      });

      act(() => callbacks['routeChangeComplete']());

      expect(stateAdventialsApp).toEqual({
        isItemsRouteChange: false,
        isItemsIdRouteChange: false,
      });
    });

    it('Should set the isItemsRouteChange state to false on error', () => {
      const callbacks = {};

      mockRouter({
        callbacks,
      });

      const { baseElement } = render(
        <App
          Component={() => {
            return <div></div>;
          }}
          pageProps={{}}
          router={{} as unknown as Router}
        />
      );

      expect(baseElement).toBeTruthy();
      expect(stateAdventialsApp).toEqual({
        isItemsRouteChange: false,
        isItemsIdRouteChange: false,
      });

      act(() =>
        callbacks['routeChangeStart'](
          'https://www.adventials.com/items?category=shields&sort=popularity&page=1'
        )
      );

      expect(stateAdventialsApp).toEqual({
        isItemsRouteChange: true,
        isItemsIdRouteChange: false,
      });

      act(() => callbacks['routeChangeError']());

      expect(stateAdventialsApp).toEqual({
        isItemsRouteChange: false,
        isItemsIdRouteChange: false,
      });
    });
  });

  describe('isItemsIdRouteChange', () => {
    it('Should set the isItemsIdRouteChange state to true', () => {
      const callbacks = {};

      mockRouter({
        callbacks,
      });

      const { baseElement } = render(
        <App
          Component={() => {
            return <div></div>;
          }}
          pageProps={{}}
          router={{} as unknown as Router}
        />
      );

      expect(baseElement).toBeTruthy();
      expect(stateAdventialsApp).toEqual({
        isItemsRouteChange: false,
        isItemsIdRouteChange: false,
      });

      act(() =>
        callbacks['routeChangeStart']('https://www.adventials.com/items/abc123')
      );

      expect(stateAdventialsApp).toEqual({
        isItemsRouteChange: false,
        isItemsIdRouteChange: true,
      });
    });

    it('Should set the isItemsIdRouteChange state to false on completion', () => {
      const callbacks = {};

      mockRouter({
        callbacks,
      });

      const { baseElement } = render(
        <App
          Component={() => {
            return <div></div>;
          }}
          pageProps={{}}
          router={{} as unknown as Router}
        />
      );

      expect(baseElement).toBeTruthy();
      expect(stateAdventialsApp).toEqual({
        isItemsRouteChange: false,
        isItemsIdRouteChange: false,
      });

      act(() =>
        callbacks['routeChangeStart']('https://www.adventials.com/items/abc123')
      );

      expect(stateAdventialsApp).toEqual({
        isItemsRouteChange: false,
        isItemsIdRouteChange: true,
      });

      act(() => callbacks['routeChangeComplete']());

      expect(stateAdventialsApp).toEqual({
        isItemsRouteChange: false,
        isItemsIdRouteChange: false,
      });
    });

    it('Should set the isItemsIdRouteChange state to false on error', () => {
      const callbacks = {};

      mockRouter({
        callbacks,
      });

      const { baseElement } = render(
        <App
          Component={() => {
            return <div></div>;
          }}
          pageProps={{}}
          router={{} as unknown as Router}
        />
      );

      expect(baseElement).toBeTruthy();
      expect(stateAdventialsApp).toEqual({
        isItemsRouteChange: false,
        isItemsIdRouteChange: false,
      });

      act(() =>
        callbacks['routeChangeStart']('https://www.adventials.com/items/abc123')
      );

      expect(stateAdventialsApp).toEqual({
        isItemsRouteChange: false,
        isItemsIdRouteChange: true,
      });

      act(() => callbacks['routeChangeError']());

      expect(stateAdventialsApp).toEqual({
        isItemsRouteChange: false,
        isItemsIdRouteChange: false,
      });
    });
  });
});
