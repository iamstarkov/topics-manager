import React from 'react';
import Link from 'next/link'
import cookies from 'next-cookies';
import fetch from 'isomorphic-unfetch';

class PageIndex extends React.Component {
  static async getInitialProps(ctx) {
    const { token } = cookies(ctx);
    let user;
    if (!!token) {
      user = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
          accept: 'application/json'
        },
      }).then(r => r.json());
    }
    return { token, user };
  }
  render() {
    const { token, user } = this.props;
    if (!token) {
      return <>
        <Link href="/login">
          <a>login</a>
        </Link>
      </>
    }
    return <>
      <h1>Hello, {user.login}</h1>
      <Link href="/logout">
        <a>logout</a>
      </Link>
    </>
  }
}

export default PageIndex;

