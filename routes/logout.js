module.exports = (req, res) => {
  res.writeHead(302, {
    Location: "/",
    "Set-Cookie": [`token=; Max-Age=0`]
  });
  return res.end();
};
