if (process.env.NOW_REGION === "dev1") {
  // eslint-disable-next-line global-require
  require("dotenv/config");
}

const http = require("http");
const crypto = require("crypto");
const urlParse = require("url").parse;
const fetch = require("isomorphic-unfetch");

const isDev = process.env.NOW_REGION === "dev1";

const b64toStr = b64 => Buffer.from(b64, "base64").toString();

const postJson = (url, body) =>
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json"
    },
    body: JSON.stringify(body)
  }).then(response => response.json());

const unwrapState = rawState => {
  try {
    return JSON.parse(b64toStr(rawState));
  } catch (e) {
    return {};
  }
};

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

// https://regexr.com/4fs7k
const deploymenHostRegExp = /^topics-manager(?:(?:\.(.*?))|(?:-(.*?)))?\.now\.sh$/;
const isValidDeploymentHost = host =>
  host === "" || deploymenHostRegExp.test(host) || host === "localhost:3000";

const isValidRedirectPath = inputPath => {
  const rawPath = urlParse(inputPath);
  if (
    rawPath.host === null &&
    rawPath.protocol === null &&
    rawPath.path !== ""
  ) {
    return true;
  }
  return false;
};

const failWith = (res, x) =>
  res
    .status(x)
    .send(`${x} ${http.STATUS_CODES[x]}`)
    .end();

const checksum = checksumFactory(process.env.CLIENT_SECRET);

/* eslint-disable camelcase */
module.exports = async (req, res) => {
  const host = req.headers["x-forwarded-host"];
  const { query } = req;
  const authorizationCode = query.code;
  const state = unwrapState(query.state);
  const deploymentHost = state.deploymentHost || "";
  const redirectPath = state.redirectPath || "/";
  const inputCsrf = state.csrf || "";
  const targetCsrf = checksum(fingerprintify(req) + req.cookies.oauthSession);

  // 1. No authorization code => throw 400
  // 2. isNotValid(deploymentHost)) => throw 400
  // 3. isNotValid(redirectPath)) => throw 400
  // 4. if no deploymentHost or its equal to host
  //  a. CSRFs dont match => throw 400
  //  b. otherwise => retrieve access token
  // 5. (deploymentHost !== host) => redirectTo(deploymentHost)
  // 6. should be unreachable => throw 400

  // 1. No authorization code => throw 400
  if (!authorizationCode) {
    return failWith(res, 400);
  }

  // 2. isNotValid(deploymentHost)) => throw 400
  if (!isValidDeploymentHost(deploymentHost)) {
    return failWith(res, 400);
  }

  // 3. isNotValid(redirectPath)) => throw 400
  if (!isValidRedirectPath(redirectPath)) {
    return failWith(res, 400);
  }

  // 4. if no deploymentHost or its equal to host
  if (deploymentHost === "" || deploymentHost === host) {
    // a. CSRFs dont match => throw 400
    if (inputCsrf !== targetCsrf) {
      return failWith(res, 400);
    }
    // b. otherwise => retrieve access token
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const { access_token } = await postJson(
      `https://github.com/login/oauth/access_token`,
      { client_id, client_secret, code: authorizationCode }
    );
    const secureFlag = isDev ? "" : "Secure";
    res.writeHead(302, {
      Location: redirectPath,
      "Set-Cookie": [
        `oauthSession=; Max-Age=0; SameSite=Lax; Path=/; HttpOnly; ${secureFlag};`,
        `token=${access_token}; Max-Age=3600; SameSite=Lax; Path=/; HttpOnly; ${secureFlag};`
      ]
    });
    return res.end();
  }

  // 5. (deploymentHost !== host) => redirectTo(deploymentHost)
  if (deploymentHost !== host) {
    const proto = deploymentHost === "localhost:3000" ? "http" : "https";

    res.writeHead(302, {
      Location: `${proto}://${deploymentHost}${req.url}`
    });
    return res.end();
  }

  // 6. should be unreachable => throw 400
  return failWith(res, 400);
};
