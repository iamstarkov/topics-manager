import React from "react";
import App from "next/app";
import withRedux from "next-redux-wrapper";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as UrqlProvider } from "urql";
import { initStore } from "../util/store";
import withUrqlClient from "../util/urql/with-client";

class CustomApp extends App {
  render() {
    const { Component, pageProps, store, urqlClient } = this.props;
    return (
      <UrqlProvider value={urqlClient}>
        <ReduxProvider store={store}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </ReduxProvider>
      </UrqlProvider>
    );
  }
}

const enhance = x => withUrqlClient(withRedux(initStore)(x));

export default enhance(CustomApp);
