import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Router from "next/router";
import cookies from "next-cookies";
import api from "../util/api";
import Wrapper from "../components/wrapper";
import Layout from "../components/layout";
import {
  ButtonAddTopics,
  ButtonRemoveAllTopics,
  ButtonRename,
  ButtonDelete
} from "../components/buttons";

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

const Topic = ({ token, repo, topics, topic }) => (
  <>
    <ButtonRename onClick={renameTopicHandler(token, repo, topics, topic)} />
    {` ${topic} `}
    <ButtonDelete onClick={removeTopicHandler(token, repo, topics, topic)} />
  </>
);

const Repository = ({ token, repo, topics }) => (
  <>
    <a href={repo.html_url}>{repo.name}</a>{" "}
    <ButtonAddTopics onClick={addTopicsHandler(token, repo, topics)} />
    {topics.names.length !== 0 && (
      <ul>
        {topics.names.map(topic => (
          <li key={topic}>
            <Topic token={token} repo={repo} topics={topics} topic={topic} />
          </li>
        ))}
        <li key="remove-all">
          <ButtonRemoveAllTopics
            onClick={removeAllTopicsHandler(token, repo)}
          />
        </li>
      </ul>
    )}
  </>
);

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
            <ul>
              {repos.map((repo, i) => (
                <li key={repo.id}>
                  <Repository repo={repo} token={token} topics={topics[i]} />
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
