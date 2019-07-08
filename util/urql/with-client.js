import React from "react";
import nextCookies from "next-cookies";

import ssrPrepass from "react-ssr-prepass";
import initUrqlClient from "./init-client";

const withUrqlClient = App => {
  return class WithUrql extends React.Component {
    static async getInitialProps(ctx) {
      const { Component, router } = ctx;
      const { token } = nextCookies(ctx.ctx);

      // Run the wrapped component's getInitialProps function
      let appProps = {};
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx);
      }

      // getInitialProps is universal, but we only want
      // to run server-side rendered suspense on the server
      if (typeof window !== "undefined") {
        return appProps;
      }

      const [urqlClient, ssrCache] = initUrqlClient({}, token);

      // Run suspense and hence all urql queries
      await ssrPrepass(
        <App
          {...appProps}
          Component={Component}
          router={router}
          urqlClient={urqlClient}
        />
      );

      // Extract query data from the Apollo store
      // Extract the SSR query data from urql's SSR cache
      const urqlState = ssrCache.extractData();

      return { ...appProps, urqlState, token };
    }

    constructor(props) {
      super(props);

      if (props.urqlClient) {
        this.urqlClient = props.urqlClient;
      } else {
        // Create the urql client and rehydrate the prefetched data
        const [urqlClient] = initUrqlClient(props.urqlState, props.token);
        this.urqlClient = urqlClient;
      }
    }

    render() {
      return <App {...this.props} urqlClient={this.urqlClient} />;
    }
  };
};

export default withUrqlClient;
