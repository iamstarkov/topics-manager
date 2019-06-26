const isDev = process.env.NOW_REGION === "dev1";

module.exports = (req, res) => {
  const secureFlag = isDev ? "" : "Secure";
  res.writeHead(302, {
    Location: "/",
    "Set-Cookie": [
      `token=; Max-Age=0; SameSite=Lax; Path=/; HttpOnly; ${secureFlag};`
    ]
  });
  return res.end();
};
