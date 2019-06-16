if (process.env.NOW_REGION === "dev1") {
  // eslint-disable-next-line global-require
  require("dotenv/config");
}

const url = require("url");

const isDev = process.env.NODE_ENV !== "production";
const prodAlias = "topics-manager.now.sh";

module.exports = (req, res) => {
  const {
    headers: { host }
  } = req;
  const deploymentHost = isDev ? "localhost:3000" : host;
  const redirectUrl = url.format({
    protocol: "https",
    host: "github.com",
    pathname: "/login/oauth/authorize",
    query: {
      client_id: process.env.CLIENT_ID,
      redirect_uri: url.format({
        protocol: "https",
        host: "topics-manager.now.sh",
        pathname: "/auth/github/callback"
      }),
      scope: "user public_repo",
      ...(host !== prodAlias
        ? { state: JSON.stringify({ deploymentHost }) }
        : {})
    }
  });
  res.writeHead(302, { Location: redirectUrl });
  res.end();
};
