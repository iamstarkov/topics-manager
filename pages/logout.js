import React from 'react'
import Router from 'next/router'

const dev = process.env.NODE_ENV !== 'production';

class PageLogout extends React.Component {
  static async getInitialProps({ res }) {
    const redirectUrl = '/';
    if (res) {
      res.writeHead(302, {
        Location: redirectUrl,
        'Set-Cookie': [`token=; Max-Age=0`],
      });
      res.end();
    } else {
      document.cookie=`token=; Max-Age=0`; 
      Router.replace(redirectUrl)
    }
    return {}
  }
}

export default PageLogout;

