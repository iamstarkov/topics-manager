const url = require("url");

module.exports = (req, res) => {
  res.writeHead(302, {
    Location: url.format({
      pathname: "/auth/github",
      query: {
        redirectPath: req.query.redirectPath || "/"
      }
    })
  });
  return res.end();
};
