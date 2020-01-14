import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { createGlobalStyle } from "styled-components";

const defaultTitle = "Topics Manager";

const light = {
  color: "#222",
  background: "#fff"
};
const dark = {
  color: "#f5f5f5",
  background: "#111"
};

const GlobalStyle = createGlobalStyle`
  body {
    color: ${light.color};
    background: ${light.background};
  }
  @media(prefers-color-scheme: dark) {
    body {
      color: ${dark.color};
      background: ${dark.background};
    }
  }
  body a {
   color: inherit;
  }
`;

const Layout = ({ children, title }) => (
  <>
    <Head>
      <title>
        {title !== defaultTitle ? `${title} • ${defaultTitle}` : title}
      </title>

      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta charSet="utf-8" />

      <link
        rel="apple-touch-icon"
        sizes="120x120"
        href="/static/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/static/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/static/favicon-16x16.png"
      />
      <link rel="manifest" href="/static/site.webmanifest" />
      <link
        rel="mask-icon"
        href="/static/safari-pinned-tab.svg"
        color="#0000"
      />
      <link rel="shortcut icon" href="/static/favicon.ico" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="msapplication-config" content="/static/browserconfig.xml" />
      <meta name="theme-color" content="#ffffff" />
    </Head>
    <>
      <GlobalStyle />
      {children}
    </>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string
};

Layout.defaultProps = {
  title: defaultTitle
};

export default Layout;
