import express from 'express';
import next from 'next';
import cookieSession from 'cookie-session';

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();


const GITHUB_CLIENT_ID = process.env.TOPICS_MANAGER_GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.TOPICS_MANAGER_GITHUB_CLIENT_SECRET;

import passport from 'passport';
import { Strategy as GithubStrategy } from 'passport-github2';

const sessionKey = 'session';
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
const scope = [ 'user', 'public_repo' ]

const login = (req, res) => { res.redirect('/auth/github'); };
const authGithub = () => {};
const authGithubCallback = (req, res) => {
  delete req.session.passport; // This adds a lot of bloat to the cookie and causes it to not get persisted.
  req.session[sessionKey] = req.user._json;
  res.redirect('/');
};

app.prepare().then(() => {
  const server = express()

  server.use(
    cookieSession({
      name: sessionKey, 
      keys: ['yolo'],
      secure: !dev,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }),
  );
  server.use(passport.initialize());
  server.use(passport.session());

  passport.use(new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: `${dev ? 'http://localhost:3000' : 'https://topics-manager.iamstarkov.now.sh'}/auth/github/callback`
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  ));

  server.get('/login', login);
  server.get('/auth/github', passport.authenticate('github', { scope }), authGithub);
  server.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), authGithubCallback);
 
  server.get('/', (req, res) => {
    if (!req.session[sessionKey]) {
      res.redirect('/login');
      return;
    }
    res.send(`<pre>${JSON.stringify(req.session[sessionKey], null, 2)}</pre>`);
  });

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
});

