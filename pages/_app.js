import React from "react";
import App, { Container } from "next/app";
import withRedux from "next-redux-wrapper";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as UrqlProvider } from "urql";
import { initStore } from "../util/store";
import CustomThemeProvider from "../components/custom-theme-provider";
import withUrqlClient from "../util/urql/with-client";

const light = {
  color: "#222",
  background: "#fff"
};
const dark = {
  color: "#f5f5f5",
  background: "#111"
};

const ClientSuspense = props =>
  typeof window !== "undefined" ? (
    <React.Suspense {...props} />
  ) : (
    <>{props.children}</>
  );

class CustomApp extends App {
  render() {
    const { Component, pageProps, store, urqlClient } = this.props;
    return (
      <Container>
        <UrqlProvider value={urqlClient}>
          <ReduxProvider store={store}>
            <CustomThemeProvider light={light} dark={dark}>
              <ClientSuspense fallback="Loading...">
                <Component {...pageProps} />
              </ClientSuspense>
            </CustomThemeProvider>
          </ReduxProvider>
        </UrqlProvider>
      </Container>
    );
  }
}

const enhance = x => withUrqlClient(withRedux(initStore)(x));

export default enhance(CustomApp);
