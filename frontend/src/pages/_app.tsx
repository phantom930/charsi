import React, { useEffect, useCallback } from "react";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import Head from "next/head";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ApolloProvider } from "@apollo/client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "react-rater/lib/react-rater.css";

import DevProvider from "@providers/DevProvider";
import SnackbarProvider from "@providers/SnackbarProvider";
import { StyleProvider } from "@providers/styles";
import CharsiProvider from "@providers/CharsiProvider";
import client from "@/graphql";
import createEmotionCache from "@utility/createEmotionCache";
import lightThemeOptions from "@styles/theme/lightThemeOptions";
import { store } from "@/store";
import "@styles/CharsiLoader.css";

interface MyAppProps extends AppProps {
  Component: AppProps["Component"] & {
    getLayout?: Function;
  };
  emotionCache?: EmotionCache;
}

interface NoopProps {
  children?: React.ReactNode;
}

const clientSideEmotionCache = createEmotionCache();
const lightTheme = createTheme(lightThemeOptions);

const Noop: React.FunctionComponent<NoopProps> = ({ children }) => (
  <>{children}</>
);

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const registerFirebaseMessagingServiceWorker = useCallback(
    (() => {
      let cache = null;

      return () => {
        if (!cache && "serviceWorker" in navigator) {
          cache = true;
          navigator.serviceWorker
            .register("/firebase-messaging-sw.js")
            .then(function (registration) {
              console.log(
                "Service Worker registration successful with scope: ",
                registration.scope
              );
              cache = true;
            })
            .catch(function (err) {
              console.log("Service Worker registration failed: ", err);
              cache = false;
            });
        }
      };
    })(),
    []
  );

  useEffect(() => {
    registerFirebaseMessagingServiceWorker();
  }, [registerFirebaseMessagingServiceWorker]);

  return (
    <>
      <Head>
        <title>Charsi Trading Platform</title>
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <ApolloProvider client={client}>
            <Provider store={store}>
              <SnackbarProvider>
                <DevProvider />
                <StyleProvider>
                  <CharsiProvider>
                    {Component.getLayout ? (
                      Component.getLayout(<Component {...pageProps} />)
                    ) : (
                      <Noop>
                        <Component {...pageProps} />
                      </Noop>
                    )}
                  </CharsiProvider>
                </StyleProvider>
              </SnackbarProvider>
            </Provider>
          </ApolloProvider>
        </ThemeProvider>
      </CacheProvider>
    </>
  );
};

export default MyApp;
