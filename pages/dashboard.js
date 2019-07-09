import React from "react";
import PropTypes from "prop-types";
import cookies from "next-cookies";
import gql from "graphql-tag";
import { useQuery } from "urql";
import api from "../util/api";
import * as auth from "../util/auth";
import createHandlers from "../util/topics-handlers";
import Wrapper from "../components/wrapper";
import Layout from "../components/layout";
import Repository from "../components/repository";
import Topic from "../components/topic";
import Toggler from "../components/toggler";

const getLogin = gql`
  query {
    viewer {
      login
    }
  }
`;

const getRepos = gql`
  query($number_of_repos: Int!) {
    viewer {
      repositories(
        first: $number_of_repos
        affiliations: OWNER
        ownerAffiliations: OWNER
        isLocked: false
        isFork: false
        orderBy: { field: NAME, direction: ASC }
      ) {
        edges {
          node {
            id
            url
            nameWithOwner
            name
            repositoryTopics(first: 100) {
              edges {
                node {
                  topic {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const Username = () => {
  const [{ data }] = useQuery({ query: getLogin });

  return <span>{data.viewer.login}</span>;
};

const noop = () => {};

const Repos = () => {
  const [{ data }] = useQuery({
    query: getRepos,
    variables: { number_of_repos: 10 }
  });
  return (
    <ul>
      {data.viewer.repositories.edges
        .map(x => x.node)
        .map(repo => (
          <li key={repo.id}>
            <Repository
              repo={{ html_url: repo.url, name: repo.name }}
              topics={{
                names: repo.repositoryTopics.edges.map(x => x.node.topic.name)
              }}
              onAddTopics={noop}
              onRemoveAllTopics={noop}
              renderTopic={topic => (
                <Topic topic={topic} onRename={noop} onRemove={noop} />
              )}
            />
          </li>
        ))}
    </ul>
  );
};

class PageDashboard extends React.Component {
  static async getInitialProps(ctx) {
    const { token } = cookies(ctx);
    if (!token) {
      return auth.redirectToLogin(ctx);
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
    if (!token) {
      return <></>;
    }
    const handlers = createHandlers(token);
    return (
      <Layout title="Dashboard">
        <Wrapper>
          <h1>
            Dashboard{" "}
            <small>
              (<a href="/logout">logout</a>)
            </small>
            <Username />
          </h1>
          <Toggler />
          <Repos />
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
  repos: PropTypes.arrayOf(PropTypes.shape()),
  topics: PropTypes.arrayOf(PropTypes.shape()),
  token: PropTypes.string
};

export default PageDashboard;
