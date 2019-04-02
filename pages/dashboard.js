import React from "react";
import Link from "next/link";
import Head from "next/head";
import cookies from "next-cookies";
import api from "../util/api";
import Wrapper from "../components/wrapper";
import Layout from "../components/layout";

const reload = () => location.reload();

const removeTopic = (token, repo, topics, topic) => {
  api.preview
    .put(`/repos/${repo.full_name}/topics`, token, {
      names: topics.names.filter(x => x !== topic)
    })
    .then(reload);
};

const renameTopic = (token, repo, topics, oldTopic, newTopic) => {
  api.preview
    .put(`/repos/${repo.full_name}/topics`, token, {
      names: topics.names.map(x => (x === oldTopic ? newTopic : x))
    })
    .then(reload);
};

const addTopics = (token, repo, topics, newTopics) => {
  api.preview
    .put(`/repos/${repo.full_name}/topics`, token, {
      names: topics.names.concat(newTopics)
    })
    .then(reload);
};

const removeAllTopics = (token, repo) => {
  api.preview
    .put(`/repos/${repo.full_name}/topics`, token, {
      names: []
    })
    .then(reload);
};

class PageDashboard extends React.Component {
  static async getInitialProps(ctx) {
    const { res } = ctx;
    const { token } = cookies(ctx);
    if (!token) {
      const redirectUrl = "/";
      if (res) {
        res.writeHead(302, { Location: redirectUrl });
        res.end();
        return;
      } else {
        Router.replace(redirectUrl);
        return;
      }
    }
    const user = await api.get(`/user`, token);
    // const rawRepos = await api.recursiveGet(`/user/repos?type=owner`, token);
    const rawRepos = await api.get(`/user/repos?type=owner`, token);
    const repos = rawRepos.filter(x => !x.fork).filter(x => !x.archived);
    const topics = await Promise.all(
      repos.map(x => api.preview.get(`/repos/${x.full_name}/topics`, token))
    );

    return { token, user, repos, topics };
  }
  render() {
    const { user, repos, topics, token } = this.props;
    return (
      <>
        <Layout title="Dashboard">
          <Wrapper>
            <h1>Dashboard</h1>
            <h2>
              Hello, @{user.login}{" "}
              <small>
                (
                <Link href="/logout">
                  <a>logout</a>
                </Link>
                )
              </small>
            </h2>
            <ul>
              {repos.map((repo, i) => (
                <li key={repo.id}>
                  <a href={repo.html_url}>{repo.name}</a>{" "}
                  <button
                    title="add a list"
                    onClick={() => {
                      const rawNewTopics = prompt(
                        `Add topics to "${
                          repo.full_name
                        }", (separate several by comma)`
                      );
                      const newTopics = rawNewTopics
                        .split(",")
                        .map(x => x.trim())
                        .filter(Boolean);
                      addTopics(token, repo, topics[i], newTopics);
                    }}
                  >
                    +
                  </button>
                  {topics[i].names.length !== 0 && (
                    <ul>
                      {topics[i].names.map(topic => (
                        <li key={topic}>
                          <button
                            title="rename"
                            onClick={() => {
                              const oldTopic = topic;
                              const newTopic = prompt(
                                `Rename topic "${oldTopic}" of a "${
                                  repo.full_name
                                }"`,
                                oldTopic
                              );
                              renameTopic(
                                token,
                                repo,
                                topics[i],
                                oldTopic,
                                newTopic
                              );
                            }}
                          >
                            ✎
                          </button>{" "}
                          {topic}{" "}
                          <button
                            title="delete"
                            onClick={() => {
                              removeTopic(token, repo, topics[i], topic);
                            }}
                          >
                            ╳
                          </button>
                        </li>
                      ))}
                      <li key="remove-all">
                        <button
                          title="remove all topics"
                          onClick={() => {
                            removeAllTopics(token, repo);
                          }}
                        >
                          💥 remove all topics
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </Wrapper>
        </Layout>
      </>
    );
  }
}

export default PageDashboard;
