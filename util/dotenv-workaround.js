const isDev = process.env.NODE_ENV !== "production";
const isNowDev = isDev && process.env.NOW_REGION === "dev1";
const isServer = typeof window === "undefined";

// `now dev` loads .env file by itself, `next` doesnt
// `now dev` exposes NOW_REGION === 'dev1', `next` doesnt
// so, we detect not `now dev` and load .env manually
// and we do it only on server, to not leak secrets
if (isServer && !isNowDev) {
  // eslint-disable-next-line global-require
  require("dotenv").config();
}
