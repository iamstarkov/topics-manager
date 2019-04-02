import React from 'react'
import Router from 'next/router'
import api from '../../../util/api';

const dev = process.env.NODE_ENV !== 'production';
const baseUrl = dev ? 'http://localhost:3000' : 'https://topics-manager.iamstarkov.now.sh';

class GithubAuthCallback extends React.Component {
  static async getInitialProps({ res, query }) {
    if (res) {
      const response = await api.post(`https://github.com/login/oauth/access_token`, null, {
        client_id: process.env.TOPICS_MANAGER_GITHUB_CLIENT_ID,
        client_secret: process.env.TOPICS_MANAGER_GITHUB_CLIENT_SECRET,
        code: query.code
      });
      const accessToken = response.access_token;
      res.writeHead(302, {
        Location: '/',
        'Set-Cookie': [`token=${accessToken}; Max-Age=${60 * 60 /* an hour */}; SameSite=Strict; Path=/; ${dev ? '' : 'Secure'}`],
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

