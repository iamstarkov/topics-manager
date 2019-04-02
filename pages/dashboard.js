import React from 'react';
import Link from 'next/link'
import Head from 'next/head'
import cookies from 'next-cookies';
import fetch from 'isomorphic-unfetch';
import Wrapper from '../components/wrapper';
import Layout from '../components/layout';

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
      <Layout title="Dashboard">
      <Wrapper>
        <h1>Dashboard</h1>
      </Wrapper>
      </Layout>
    </>
  }
}

export default PageIndex;


