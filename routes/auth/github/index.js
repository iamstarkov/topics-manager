if (process.env.NOW_REGION === "dev1") {
  // eslint-disable-next-line global-require
  require("dotenv/config");
}

const url = require("url");

const isProd = process.env.NODE_ENV === "production";

/* eslint-disable camelcase */
module.exports = (req, res) => {
  const deploymentHost = isProd ? req.headers.host : "localhost:3000";

  const redirect_uri = "https://topics-manager.now.sh/auth/github/callback";
  const client_id = process.env.CLIENT_ID;
  const scope = "user public_repo";
  const state = JSON.stringify({ deploymentHost });

  res.writeHead(302, {
    Location: `https://github.com/login/oauth/authorize${url.format({
      query: { client_id, redirect_uri, scope, state }
    })}`
  });
  return res.end();
};
