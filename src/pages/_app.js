// ** Next Imports
import Head from "next/head";
import Script from "next/script";
import { Router } from "next/router";
import store from "../store/store";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// ** Loader Import
import NProgress from "nprogress";

// ** Emotion Imports
import { CacheProvider } from "@emotion/react";

// ** Config Imports

import themeConfig from "src/configs/themeConfig";

// ** Third Party Import
import { Toaster } from "react-hot-toast";

// ** Component Imports
import UserLayout from "src/layouts/UserLayout";
import ThemeComponent from "src/@core/theme/ThemeComponent";
import AuthGuard from "src/@core/components/auth/AuthGuard";
import GuestGuard from "src/@core/components/auth/GuestGuard";

// ** Spinner Import
import Spinner from "src/@core/components/spinner";

// ** Contexts
import { AuthProvider } from "src/context/AuthContext";
import {
  SettingsConsumer,
  SettingsProvider,
} from "src/@core/context/settingsContext";

// ** Styled Components
import ReactHotToast from "src/@core/styles/libs/react-hot-toast";

// ** Utils Imports
import { createEmotionCache } from "src/@core/utils/create-emotion-cache";

// ** Prismjs Styles
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

// ** React Perfect Scrollbar Style
import "react-perfect-scrollbar/dist/css/styles.css";
import "src/iconify-bundle/icons-bundle-react";

// ** Global css styles
import "../../styles/globals.css";

const clientSideEmotionCache = createEmotionCache();

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on("routeChangeStart", () => {
    NProgress.start();
  });
  Router.events.on("routeChangeError", () => {
    NProgress.done();
  });
  Router.events.on("routeChangeComplete", () => {
    NProgress.done();
  });
}

const Guard = ({ children, authGuard, guestGuard }) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>;
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>;
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>;
  }
};
const queryClient = new QueryClient()

// ** Configure JSS & ClassName
const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false;

  const getLayout =
    Component.getLayout ??
    ((page) => (
      <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>
    ));
  const setConfig = Component.setConfig ?? undefined;
  const authGuard = Component.authGuard ?? true;
  const guestGuard = Component.guestGuard ?? false;


  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{`${themeConfig.templateName}`}</title>
        <meta name="description" content={`${themeConfig.templateName} `} />
        <meta
          name="keywords"
          content="A Software for Fitness trainers to manage their clients online and track their progress"
        />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-GFVE6H2T8Y"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-GFVE6H2T8Y');
        `}
      </Script>

      {/* Google Ads Script */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-16853228766"
      />
      <Script
        id="google-ads"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'AW-16853228766');
        `}
      </Script>

      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <AuthProvider>
            <SettingsProvider
              {...(setConfig ? { pageSettings: setConfig() } : {})}
            >
              <SettingsConsumer>
                {({ settings }) => {
                  return (
                    <ThemeComponent settings={settings}>
                      <Guard authGuard={authGuard} guestGuard={guestGuard}>
                        {getLayout(<Component {...pageProps} />)}
                      </Guard>
                      <ReactHotToast>
                        <Toaster
                          position={settings.toastPosition}
                          toastOptions={{ className: "react-hot-toast", style: {zIndex: 10000} }}
                        />
                      </ReactHotToast>
                    </ThemeComponent>
                  );
                }}
              </SettingsConsumer>
            </SettingsProvider>
          </AuthProvider>
        </Provider>
      </QueryClientProvider>
    </CacheProvider>
  );
};

export default App;
