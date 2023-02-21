import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import Footer from '../components/app/footer';
import Header from '../components/app/header';
import ItemSkeleton from '../components/items/item-skeleton';
import ItemsSkeleton from '../components/items/items-skeleton';
import { store } from '../store';
import { theme } from '../theme';
import './styles.scss';

export let stateAdventialsApp;

function AdventialsApp({ Component, pageProps }: AppProps) {
  const [state, setState] = useState({
    isItemsRouteChange: false,
    isItemsIdRouteChange: false,
  });
  stateAdventialsApp = state;
  const router = useRouter();

  useEffect(() => {
    const onRouteChangeStart = (url: string) => {
      // if it is the /items route
      if (url.match(/^.*\/items\/?\?.*$/)) {
        setState({
          ...state,
          isItemsRouteChange: true,
        });
      } else if (
        // if it is the /items/[id] route
        url.match(/^.*\/items\/.*$/)
      ) {
        setState({
          ...state,
          isItemsIdRouteChange: true,
        });
      }
    };

    const onRouteChangeComplete = () => {
      setState({
        ...state,
        isItemsRouteChange: false,
        isItemsIdRouteChange: false,
      });
    };

    router.events.on('routeChangeStart', onRouteChangeStart);
    router.events.on('routeChangeComplete', onRouteChangeComplete);
    router.events.on('routeChangeError', onRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', onRouteChangeStart);
      router.events.off('routeChangeComplete', onRouteChangeComplete);
      router.events.off('routeChangeError', onRouteChangeComplete);
    };
  }, []);

  const renderContent = () => {
    if (state.isItemsRouteChange) {
      return <ItemsSkeleton />;
    } else if (state.isItemsIdRouteChange) {
      return <ItemSkeleton />;
    }

    return <Component {...pageProps} />;
  };

  return (
    <>
      <Head>
        <title>Adventials - Adventure Essentials</title>
      </Head>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <CssBaseline />
            <Header />
            <main className="adventials">{renderContent()}</main>
            <Footer />
          </Provider>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  );
}

export default appWithTranslation(AdventialsApp);
