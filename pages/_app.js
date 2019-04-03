import React from "react";
import App, { Container } from "next/app";
import withRedux from "next-redux-wrapper";
import { Provider } from "react-redux";
import { initStore } from "../util/store";
import CustomThemeProvider from "../components/custom-theme-provider";

const light = {
  color: "#222",
  background: "#fff"
};
const dark = {
  color: "#f5f5f5",
  background: "#111"
};

class CustomApp extends App {
  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Container>
        <Provider store={store}>
          <CustomThemeProvider light={light} dark={dark}>
            <Component {...pageProps} />
          </CustomThemeProvider>
        </Provider>
      </Container>
    );
  }
}

export default withRedux(initStore)(CustomApp);
