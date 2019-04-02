import React from 'react';
import Link from 'next/link'
import Head from 'next/head'
import cookies from 'next-cookies';
import api from '../util/api';
import Wrapper from '../components/wrapper';
import Layout from '../components/layout';

class PageDashboard extends React.Component {
  static async getInitialProps(ctx) {
    const { token } = cookies(ctx);
    let user;
    if (!!token) {
      user = await api.get('/user', token);
    }
    return { token, user };
  }
  render() {
    const { user } = this.props;
    return <>
      <Layout title="Dashboard">
      <Wrapper>
        <h1>Dashboard</h1>
        <h2>Hello, @{user.login}</h2>
      </Wrapper>
      </Layout>
    </>
  }
}

export default PageDashboard;


