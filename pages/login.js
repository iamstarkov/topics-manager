import React from "react";

class PageLogin extends React.Component {
  static async getInitialProps({ res }) {
    const redirectUrl = "/auth/github";
    if (res) {
      res.writeHead(302, { Location: redirectUrl });
      res.end();
    } else {
      // eslint-disable-next-line no-restricted-globals
      location = redirectUrl;
    }
    return {};
  }

  render() {
    return <></>;
  }
}

export default PageLogin;
