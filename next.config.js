module.exports = {
  target: "serverless",
  webpack(config) {
    // eslint-disable-next-line no-param-reassign
    config.externals = (config.externals || []).concat(["fs", "encoding"]);
    return config;
  }
};
