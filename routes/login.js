module.exports = (req, res) => {
  const redirectPath = req.query.redirectPath || "/";
  res.writeHead(302, { Location: `/auth/github?redirectPath=${redirectPath}` });
  return res.end();
};
