export const redirectToLogin = ctx => {
  const { res, asPath } = ctx;
  const redirectUrl = `/login?redirectPath=${encodeURIComponent(asPath)}`;
  if (res) {
    res.writeHead(302, { Location: redirectUrl });
    return res.end();
  }
  // eslint-disable-next-line no-restricted-globals
  location.assign(redirectUrl);
  return {};
};
