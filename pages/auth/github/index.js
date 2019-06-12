import React from "react";
import Router from "next/router";
import "../../../util/dotenv-workaround";

const isDev = process.env.NODE_ENV !== "production";

const baseUrl = isDev
  ? "http://localhost:3000"
  : "https://topics-manager.now.sh";

const getRedirectUrl = ({ clientId, callbackUrl, scope }) =>
  `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${callbackUrl}&scope=${scope}`;

class GithubAuthRedirect extends React.Component {
  static async getInitialProps({ res }) {
    const redirectUrl = getRedirectUrl({
      clientId: process.env.CLIENT_ID,
      callbackUrl: `${baseUrl}/auth/github/callback`,
      scope: "user,public_repo"
    });
    if (res) {
      res.writeHead(302, { Location: redirectUrl });
      res.end();
    } else {
      Router.replace(redirectUrl);
    }
    return {};
  }
}

export default GithubAuthRedirect;
