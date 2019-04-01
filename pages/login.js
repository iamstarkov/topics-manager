import React from 'react'
import Router from 'next/router'

class PageLogin extends React.Component {
  static async getInitialProps({ res }) {
    const redirectUrl = '/auth/github';
    if (res) {
      res.writeHead(302, { Location: redirectUrl });
      res.end();
    } else {
      location = redirectUrl
    }
    return {}
  }
}

export default PageLogin;
