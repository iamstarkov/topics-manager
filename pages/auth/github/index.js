import React from 'react'
import Router from 'next/router'

const dev = process.env.NODE_ENV !== 'production';
const baseUrl = dev ? 'http://localhost:3000' : 'https://topics-manager.iamstarkov.now.sh';

const getRedirectUrl = ({
  clientId, callbackUrl, scope
}) => `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${callbackUrl}&scope=${scope}`;

class GithubAuthRedirect extends React.Component {
  static async getInitialProps({ res }) {
    const redirectUrl =  getRedirectUrl({
      clientId: process.env.TOPICS_MANAGER_GITHUB_CLIENT_ID,
      callbackUrl: `${baseUrl}/auth/github/callback`,
      scope: 'user,public_repo',
    });
    if (res) {
      res.writeHead(302, { Location: redirectUrl }); 
      res.end();
    } else {
      Router.replace(redirectUrl)
    }
    return {}
  }
}

export default GithubAuthRedirect; 
