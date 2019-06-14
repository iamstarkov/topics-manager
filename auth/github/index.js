if (process.env.NOW_REGION === "dev1") {
  // eslint-disable-next-line global-require
  require("dotenv/config");
}

const url = require("url");

const isDev = process.env.NODE_ENV !== "production";

const deploymentRegExp = /topics-manager-([\w]{9})\.now\.sh/;
const isStaging = host => deploymentRegExp.test(host);
const getDeploymentId = host => deploymentRegExp.exec(host)[1];

module.exports = (req, res) => {
  const {
    headers: { host }
  } = req;
  const redirectUrl = url.format({
    protocol: "https",
    host: "github.com",
    pathname: "/login/oauth/authorize",
    query: {
      client_id: process.env.CLIENT_ID,
      redirect_uri: url.format({
        protocol: isDev ? "http" : "https",
        host: isDev ? "localhost:3000" : "topics-manager.now.sh",
        pathname: "/auth/github/callback"
      }),
      scope: "user public_repo",
      state: JSON.stringify({
        ...(isStaging(host) ? { deploymentId: getDeploymentId(host) } : {})
      })
    }
  });
  res.writeHead(302, { Location: redirectUrl });
  res.end();
};
