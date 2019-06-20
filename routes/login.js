module.exports = (req, res) => {
  res.writeHead(302, { Location: `/auth/github` });
  return res.end();
};
