import React from "react";
import url from "url";
import api from "../../../util/api";
import "../../../util/dotenv-workaround";

const isDev = process.env.NODE_ENV !== "production";

const getDeploymentHost = id => `topics-manager-${id}.now.sh`;
const omit = (key, object) => {
  const copyObject = { ...object };
  delete copyObject[key];
  return copyObject;
};

class GithubAuthCallback extends React.Component {
  static async getInitialProps({ res, query }) {
    if (res) {
      const state = JSON.parse(query.state || {});
      const { deploymentId } = state;

      if (!isDev && deploymentId) {
        res.writeHead(302, {
          Location: url.format({
            protocol: "https",
            host: getDeploymentHost(deploymentId),
            pathname: "/auth/github/callback",
            query: {
              ...omit("state", query),
              state: JSON.stringify(omit("deploymentId", state))
            }
          })
        });
        res.end();
        return;
      }

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
      // eslint-disable-next-line no-restricted-globals
      location.href = "/auth/github";
    }
  }
}

export default GithubAuthCallback;
