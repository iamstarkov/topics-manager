import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import cookies from "next-cookies";
import Wrapper from "../components/wrapper";
import Layout from "../components/layout";

class PageIndex extends React.Component {
  static async getInitialProps(ctx) {
    const { token } = cookies(ctx);
    return { token };
  }

  render() {
    const { token } = this.props;
    return (
      <Layout>
        <Wrapper>
          <h1>Welcome to Topics Manager!</h1>
          <p>
            This app aims to address inconvenience of default topics editing
            interface. Topics Manager will give a dashboard to overview and edit
            topics of your GitHub repositories.
          </p>
          {!token && (
            <p>
              <a href="/login">Login with GitHub</a> to start.
            </p>
          )}
          {token && (
            <p>
              <Link href="/dashboard">
                <a>Open dashboard</a>
              </Link>{" "}
              to start or{" "}
              <Link href="/logout">
                <a>logout</a>
              </Link>{" "}
              to finish the session.
            </p>
          )}
        </Wrapper>
      </Layout>
    );
  }
}

PageIndex.propTypes = {
  token: PropTypes.string
};

export default PageIndex;
