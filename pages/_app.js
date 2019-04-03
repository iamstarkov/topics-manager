import React from "react";
import App, { Container } from "next/app";
import { ThemeProvider } from "styled-components";
import withRedux from "next-redux-wrapper";
import { Provider, connect } from "react-redux";
import { initStore } from "../util/store";
import * as ducks from "../ducks";

const light = {
  color: "#222",
  background: "#fff"
};
const dark = {
  color: "#f5f5f5",
  background: "#111"
};
const mapStateToProps = state => ({
  isDark: ducks.theme.selectors.isDark(state)
});
const ConnectedThemeProvider = connect(mapStateToProps)(
  ({ isDark, children }) => (
    <ThemeProvider theme={isDark ? dark : light}>{children}</ThemeProvider>
  )
);

class CustomApp extends App {
  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Container>
        <Provider store={store}>
          <ConnectedThemeProvider>
            <Component {...pageProps} />
          </ConnectedThemeProvider>
        </Provider>
      </Container>
    );
  }
}

export default withRedux(initStore)(CustomApp);
