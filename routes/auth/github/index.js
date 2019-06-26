if (process.env.NOW_REGION === "dev1") {
  // eslint-disable-next-line global-require
  require("dotenv/config");
}

const url = require("url");
const crypto = require("crypto");
const nanoid = require("nanoid");

const isDev = process.env.NOW_REGION === "dev1";

const strToB64 = str => Buffer.from(str).toString("base64");

const checksumFactory = secret => text =>
  crypto
    .createHmac("sha256", secret)
    .update(text)
    .digest("hex");

const fingerprintify = req => {
  const ip = req.headers["x-forwarded-for"];
  const useragent = req.headers["user-agent"];
  const language = req.headers["accept-language"];
  const { accept } = req.headers;

  return [ip, useragent, language, accept].join(",");
};

const checksum = checksumFactory(process.env.CLIENT_SECRET);

/* eslint-disable camelcase */
module.exports = (req, res) => {
  const deploymentHost = req.headers["x-forwarded-host"];

  const oauthSession = nanoid();

  const redirect_uri = "https://topics-manager.now.sh/auth/github/callback";
  const client_id = process.env.CLIENT_ID;
  const scope = "user public_repo";
  const state = strToB64(
    JSON.stringify({
      deploymentHost,
      redirectPath: req.query.redirectPath,
      csrf: checksum(fingerprintify(req) + oauthSession)
    })
  );

  const secureFlag = isDev ? "" : "Secure";
  res.writeHead(302, {
    // limit to 10 minutes to automatically reject stale oauth flows/sessions
    "Set-Cookie": `oauthSession=${oauthSession}; Max-Age=600; SameSite=Lax; Path=/; HttpOnly; ${secureFlag}`,
    Location: `https://github.com/login/oauth/authorize${url.format({
      query: { client_id, redirect_uri, scope, state }
    })}`
  });
  return res.end();
};
