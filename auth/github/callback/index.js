if (process.env.NOW_REGION === "dev1") {
  // eslint-disable-next-line global-require
  require("dotenv/config");
}

const url = require("url");
const fetch = require("isomorphic-unfetch");
const evolve = require("ramda/src/evolve");
const pipe = require("ramda/src/pipe");
const dissoc = require("ramda/src/dissoc");

const isDev = process.env.NODE_ENV !== "production";
const prodAlias = "topics-manager.now.sh";

// https://regexr.com/4fs7k
const deploymenHostRegExp = /topics-manager(?:(?:\.(.*?))|(?:-(.*?)))?\.now\.sh/;

const accessToken = code =>
  fetch(`https://github.com/login/oauth/access_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json"
    },
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code
    })
  })
    .then(response => response.json())
    .then(result => result.access_token);

module.exports = async (req, res) => {
  const {
    headers: { host }
  } = req;
  const { query } = url.parse(req.url, true);
  const state = query.state ? JSON.parse(query.state) : {};
  const { deploymentHost } = state;
  const isValidDeploymentHost =
    deploymenHostRegExp.test(deploymentHost) ||
    deploymentHost === "localhost:3000";

  // it is almost fine to redirect anywhere with auth code,
  // but in order to mitigate risks as in auth code exposure
  // redirects are limited to deployments and localhost
  if (prodAlias === host && isValidDeploymentHost) {
    res.writeHead(302, {
      Location: url.format({
        protocol: deploymentHost === "localhost:3000" ? "http" : "https",
        host: deploymentHost,
        pathname: "/auth/github/callback",
        query: evolve(
          {
            state: pipe(
              JSON.parse,
              dissoc("deploymentHost"),
              JSON.stringify
            )
          },
          query
        )
      })
    });
    return res.end();
  }

  const token = await accessToken(query.code);
  res.writeHead(302, {
    Location: "/",
    "Set-Cookie": [
      `token=${token}; Max-Age=${
        60 * 60 /* an hour */
      }; SameSite=Lax; Path=/; ${isDev ? "" : "Secure"}`
    ]
  });
  return res.end();
};
