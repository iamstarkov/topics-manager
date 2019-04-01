import React from 'react'
import Router from 'next/router'
import fetch from 'isomorphic-unfetch';

const dev = process.env.NODE_ENV !== 'production';
const baseUrl = dev ? 'http://localhost:3000' : 'https://topics-manager.iamstarkov.now.sh';

class GithubAuthCallback extends React.Component {
  static async getInitialProps({ res, query }) {
    if (res) {
      const response = await fetch(`https://github.com/login/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json'
        },
        body: JSON.stringify({
          client_id: process.env.TOPICS_MANAGER_GITHUB_CLIENT_ID,
          client_secret: process.env.TOPICS_MANAGER_GITHUB_CLIENT_SECRET,
          code: query.code
        })
      }).then(r => r.json());
      const accessToken = response.access_token;
      res.writeHead(302, {
        Location: '/',
        'Set-Cookie': [`token=${accessToken}; SameSite=Strict; Path=/; ${dev ? '' : 'Secure'}`],
      });
      res.end();
    } else {
      // this page isnt meant to be accessible
      // via client side navigation,
      // thus the best shot is to restart the oauth2 flow
      Router.replace('/auth/github/');
    }
    return {}
  }
}

export default GithubAuthCallback; 

