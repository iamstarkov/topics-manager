if (process.env.NOW_REGION === "dev1") {
  // eslint-disable-next-line global-require
  require("dotenv/config");
}

const url = require("url");
const fetch = require("isomorphic-unfetch");

const isDev = process.env.NODE_ENV !== "production";

const getDeploymentHost = id => `topics-manager-${id}.now.sh`;
const omit = (key, object) => {
  const copyObject = { ...object };
  delete copyObject[key];
  return copyObject;
};

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
  const { query } = url.parse(req.url, true);
  const state = JSON.parse(query.state || {});
  const { deploymentId } = state;

  if (deploymentId) {
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
