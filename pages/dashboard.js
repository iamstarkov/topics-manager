import React from "react";
import PropTypes from "prop-types";
import Router from "next/router";
import cookies from "next-cookies";
import { URL } from "url";
import api from "../util/api";
import createHandlers from "../util/topics-handlers";
import Wrapper from "../components/wrapper";
import Layout from "../components/layout";
import Repository from "../components/repository";
import Topic from "../components/topic";
import Toggler from "../components/toggler";

class PageDashboard extends React.Component {
  static async getInitialProps(ctx) {
    const { req, res } = ctx;
    const { token } = cookies(ctx);
    if (!token) {
      const redirectUrl = u =>
        `/login?redirectPath=${encodeURIComponent(u.pathname + u.search)}`;
      if (res) {
        const { headers } = req;
        const currentUrl = new URL(
          `${headers["x-forwarded-proto"]}://${headers["x-forwarded-host"]}${
            req.url
          }`
        );
        res.writeHead(302, { Location: redirectUrl(currentUrl) });
        return res.end();
      }
      // eslint-disable-next-line no-restricted-globals
      return Router.replace(redirectUrl(new URL(location.href)));
    }
    const rawRepos = await api.get(`/user/repos?type=owner`, token);
    const repos = rawRepos.filter(x => !x.fork).filter(x => !x.archived);
    const topics = await Promise.all(
      repos.map(x => api.preview.get(`/repos/${x.full_name}/topics`, token))
    );

    return { token, repos, topics };
  }

  render() {
    const { repos, topics, token } = this.props;
    const handlers = createHandlers(token);
    return (
      <Layout title="Dashboard">
        <Wrapper>
          <h1>
            Dashboard{" "}
            <small>
              (<a href="/logout">logout</a>)
            </small>
          </h1>
          <Toggler />
          <ul>
            {repos.map((repo, i) => (
              <li key={repo.id}>
                <Repository
                  repo={repo}
                  topics={topics[i]}
                  onAddTopics={handlers.addTopics(repo, topics[i])}
                  onRemoveAllTopics={handlers.removeAllTopics(repo)}
                  renderTopic={topic => (
                    <Topic
                      topic={topic}
                      onRename={handlers.renameTopic(repo, topics[i], topic)}
                      onRemove={handlers.removeTopic(repo, topics[i], topic)}
                    />
                  )}
                />
              </li>
            ))}
          </ul>
        </Wrapper>
      </Layout>
    );
  }
}

PageDashboard.propTypes = {
  repos: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  topics: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  token: PropTypes.string.isRequired
};

export default PageDashboard;
