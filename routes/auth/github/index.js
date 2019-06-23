if (process.env.NOW_REGION === "dev1") {
  // eslint-disable-next-line global-require
  require("dotenv/config");
}

const url = require("url");

/* eslint-disable camelcase */
module.exports = (req, res) => {
  const deploymentHost = req.headers["x-forwarded-host"];

  const redirect_uri = "https://topics-manager.now.sh/auth/github/callback";
  const client_id = process.env.CLIENT_ID;
  const scope = "user public_repo";
  const state = JSON.stringify({
    deploymentHost,
    redirectPath: req.query.redirectPath
  });

  res.writeHead(302, {
    Location: `https://github.com/login/oauth/authorize${url.format({
      query: { client_id, redirect_uri, scope, state }
    })}`
  });
  return res.end();
};
