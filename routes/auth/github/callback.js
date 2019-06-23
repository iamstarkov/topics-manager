if (process.env.NOW_REGION === "dev1") {
  // eslint-disable-next-line global-require
  require("dotenv/config");
}

const http = require("http");
const urlParse = require("url").parse;
const fetch = require("isomorphic-unfetch");

const isDev = process.env.NOW_REGION === "dev1";

const postJson = (url, body) =>
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json"
    },
    body: JSON.stringify(body)
  }).then(response => response.json());

const getDeploymentHost = query => {
  try {
    return JSON.parse(query.state).deploymentHost || "";
  } catch (e) {
    return "";
  }
};
const getRedirectPath = query => {
  try {
    return JSON.parse(query.state).redirectPath || "/";
  } catch (e) {
    return "/";
  }
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

/* eslint-disable camelcase */
module.exports = async (req, res) => {
  const host = req.headers["x-forwarded-host"];
  const { query } = req;
  const authorizationCode = query.code;
  const deploymentHost = getDeploymentHost(query);
  const redirectPath = getRedirectPath(query);

  // 0. No authorization code => throw 400
  // 1. isNotValid(deploymentHost)) => throw 400
  // 2. isNotValid(redirectPath)) => throw 400
  // 3. if no deploymentHost or its equal to host => retrieve access token
  // 4. (deploymentHost !== host) => redirectTo(deploymentHost)
  // 5. should be unreachable => throw 400

  // 0. No authorization code => throw 400
  if (!authorizationCode) {
    return failWith(res, 400);
  }

  // 1. isNotValid(deploymentHost)) => throw 400
  if (!isValidDeploymentHost(deploymentHost)) {
    return failWith(res, 400);
  }

  // 2. isNotValid(redirectPath)) => throw 400
  if (!isValidRedirectPath(redirectPath)) {
    return failWith(res, 400);
  }

  // 3. if no deploymentHost or its equal to host => retrieve access token
  if (deploymentHost === "" || deploymentHost === host) {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const { access_token } = await postJson(
      `https://github.com/login/oauth/access_token`,
      { client_id, client_secret, code: authorizationCode }
    );
    res.writeHead(302, {
      Location: redirectPath,
      "Set-Cookie": `token=${access_token}; Max-Age=3600; SameSite=Lax; Path=/; {isDev ? "" : "Secure"}`
    });
    return res.end();
  }

  // 4. (deploymentHost !== host) => redirectTo(deploymentHost)
  if (deploymentHost !== host) {
    const proto = isDev ? "http" : "https";

    res.writeHead(302, {
      Location: `${proto}://${deploymentHost}${req.url}`
    });
    return res.end();
  }

  // 5. should be unreachable => throw 400
  return failWith(res, 400);
};
