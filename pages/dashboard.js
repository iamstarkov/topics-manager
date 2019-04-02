import React from 'react';
import Link from 'next/link'
import Head from 'next/head'
import cookies from 'next-cookies';
import api from '../util/api';
import Wrapper from '../components/wrapper';
import Layout from '../components/layout';

class PageDashboard extends React.Component {
  static async getInitialProps(ctx) {
    const { res } = ctx;
    const { token } = cookies(ctx);
    if (!token) {
      const redirectUrl = '/';
      if (res) {
        res.writeHead(302, { Location: redirectUrl });
        res.end();
        return;
      } else {
        Router.replace(redirectUrl)
        return;
      }
    }
    const [user, repos] = await Promise.all([
      api.get('/user', token),
      api.get('/user/repos?type=owner', token),
    ]);

    return { user, repos };
  }
  render() {
    const { user, repos } = this.props;
    return <>
      <Layout title="Dashboard">
      <Wrapper>
        <h1>Dashboard</h1>
        <h2>Hello, @{user.login} <small>(<Link href="/logout"><a>logout</a></Link>)</small></h2>
        <ul>
          {repos.map(x => (<li key={x.id}>{x.full_name}</li>))}
        </ul>
      </Wrapper>
      </Layout>
    </>
  }
}

export default PageDashboard;


