import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Router from "next/router";
import cookies from "next-cookies";
import api from "../util/api";
import Wrapper from "../components/wrapper";
import Layout from "../components/layout";
import Repository from "../components/repository";
import Topic from "../components/topic";
import Toggler from "../components/toggler";

/* eslint-disable no-alert */
// eslint-disable-next-line no-restricted-globals
const reload = () => location.reload();

const removeTopic = (token, repo, topics, topic) => {
  api.preview
    .put(`/repos/${repo.full_name}/topics`, token, {
      names: topics.names.filter(x => x !== topic)
    })
    .then(reload);
};

const removeTopicHandler = (...args) => () => {
  removeTopic(...args);
};

const renameTopic = (token, repo, topics, oldTopic, newTopic) => {
  api.preview
    .put(`/repos/${repo.full_name}/topics`, token, {
      names: topics.names.map(x => (x === oldTopic ? newTopic : x))
    })
    .then(reload);
};

const renameTopicHandler = (token, repo, topics, oldTopic) => () => {
  const newTopic = prompt(
    `Rename topic "${oldTopic}" of a "${repo.full_name}"`,
    oldTopic
  );
  renameTopic(token, repo, topics, oldTopic, newTopic);
};

const addTopics = (token, repo, topics, newTopics) => {
  api.preview
    .put(`/repos/${repo.full_name}/topics`, token, {
      names: topics.names.concat(newTopics)
    })
    .then(reload);
};

const addTopicsHandler = (token, repo, topics) => () => {
  const rawNewTopics = prompt(
    `Add topics to "${repo.full_name}", (separate several by comma)`
  );
  const newTopics = rawNewTopics
    .split(",")
    .map(x => x.trim())
    .filter(Boolean);
  addTopics(token, repo, topics, newTopics);
};

const removeAllTopics = (token, repo) => {
  api.preview
    .put(`/repos/${repo.full_name}/topics`, token, {
      names: []
    })
    .then(reload);
};
const removeAllTopicsHandler = (...args) => () => {
  removeAllTopics(...args);
};

class PageDashboard extends React.Component {
  static async getInitialProps(ctx) {
    const { res } = ctx;
    const { token } = cookies(ctx);
    if (!token) {
      const redirectUrl = "/";
      if (res) {
        res.writeHead(302, { Location: redirectUrl });
        return res.end();
      }
      return Router.replace(redirectUrl);
    }
    // const rawRepos = await api.recursiveGet(`/user/repos?type=owner`, token);
    const rawRepos = await api.get(`/user/repos?type=owner`, token);
    const repos = rawRepos.filter(x => !x.fork).filter(x => !x.archived);
    const topics = await Promise.all(
      repos.map(x => api.preview.get(`/repos/${x.full_name}/topics`, token))
    );

    return { token, repos, topics };
  }

  render() {
    const { repos, topics, token } = this.props;
    return (
      <>
        <Layout title="Dashboard">
          <Wrapper>
            <h1>
              Dashboard{" "}
              <small>
                (
                <Link href="/logout">
                  <a>logout</a>
                </Link>
                )
              </small>
            </h1>
            <Toggler />
            <ul>
              {repos.map((repo, i) => (
                <li key={repo.id}>
                  <Repository
                    repo={repo}
                    topics={topics[i]}
                    onAddTopics={addTopicsHandler(token, repo, topics[i])}
                    onRemoveAllTopics={removeAllTopicsHandler(token, repo)}
                    renderTopic={topic => (
                      <Topic
                        topic={topic}
                        onRename={renameTopicHandler(
                          token,
                          repo,
                          topics[i],
                          topic
                        )}
                        onDelete={removeTopicHandler(
                          token,
                          repo,
                          topics[i],
                          topic
                        )}
                      />
                    )}
                  />
                </li>
              ))}
            </ul>
          </Wrapper>
        </Layout>
      </>
    );
  }
}

PageDashboard.propTypes = {
  repos: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  topics: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  token: PropTypes.string.isRequired
};

export default PageDashboard;
