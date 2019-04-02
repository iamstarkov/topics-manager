import React from 'react';
import Link from 'next/link'
import Head from 'next/head'
import cookies from 'next-cookies';
import api from '../util/api';
import Wrapper from '../components/wrapper';
import Layout from '../components/layout';

class PageIndex extends React.Component {
  static async getInitialProps(ctx) {
    const { token } = cookies(ctx);
    let user;
    if (!!token) {
      user = await api.get('/user', token);
    }
    return { token, user };
  }
  render() {
    const { token, user } = this.props;
    return <>
      <Layout>
      <Wrapper>
        <h1>Welcome to "Topics Manager"!</h1>
        <p>
          This app aims to address inconvenience of default topics editing interface. Topics Manager will give a dashboard to overview and edit topics of your GitHub repositories.
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
      </Layout>
    </>
  }
}

export default PageIndex;

