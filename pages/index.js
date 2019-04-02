import React from 'react';
import Link from 'next/link'
import cookies from 'next-cookies';
import fetch from 'isomorphic-unfetch';
import Wrapper from '../components/wrapper';

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
    return <>
      <Wrapper>
        <h1>Welcome to "Topics Manager"!</h1>
        <p>
          Regardless of how many repositories you have on your GitHub account, we all can agree that its UI is not very convenient to use.
        </p>
        <p>
          This website aims to address this issue. Topics Manager will give you an consistent dashboard to overview and edit topics on your GitHub repositories in bulk and one by one.
        </p>
        <p>
         Topics Manager will need access to your GitHub account's repositories in order to manage its keywords.
        </p>
        {!token && (
          <p>
            <Link href="/login"><a>Login with GitHub</a></Link> to start.
          </p> 
        )}
        {!!token && (
          <p>
            <Link href="/dashboard"><a>Open dashboard</a></Link> to start or <Link href="/logout"><a>logout</a></Link> to finish the session.
          </p>
        )}
      </Wrapper>
    </>
  }
}

export default PageIndex;

