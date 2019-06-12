import React from "react";
import Router from "next/router";
import api from "../../../util/api";
import "../../../util/dotenv-workaround";

const isDev = process.env.NODE_ENV !== "production";

class GithubAuthCallback extends React.Component {
  static async getInitialProps({ res, query }) {
    if (res) {
      const response = await api.post(
        `https://github.com/login/oauth/access_token`,
        null,
        {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code: query.code
        }
      );
      const accessToken = response.access_token;
      res.writeHead(302, {
        Location: "/",
        "Set-Cookie": [
          `token=${accessToken}; Max-Age=${
            60 * 60 /* an hour */
          }; SameSite=Lax; Path=/; ${isDev ? "" : "Secure"}`
        ]
      });
      res.end();
    } else {
      // this page isnt meant to be accessible
      // via client side navigation,
      // thus the best shot is to restart the oauth2 flow
      Router.replace("/auth/github/");
    }
    return {};
  }
}

export default GithubAuthCallback;
