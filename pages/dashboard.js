import React from "react";
import cookies from "next-cookies";
import gql from "graphql-tag";
import { useQuery, useMutation } from "urql";
import * as auth from "../util/auth";
import Wrapper from "../components/wrapper";
import Layout from "../components/layout";
import Repository from "../components/repository";
import Topic from "../components/topic";
import Toggler from "../components/toggler";

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

const updateTopics = gql`
  mutation updateTopics($id: ID!, $topicNames: [String!]!) {
    updateTopics(input: { repositoryId: $id, topicNames: $topicNames }) {
      repository {
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
`;

const validateTopics = str =>
  str
    .split(" ")
    .map(x => x.trim())
    .filter(Boolean);

const Repos = () => {
  const [{ data }] = useQuery({
    query: getRepos,
    variables: { number_of_repos: 10 }
  });
  const [, executeUpdateTopics] = useMutation(updateTopics);
  return (
    <ul>
      {data.viewer.repositories.edges
        .map(x => x.node)
        .map(repo => ({
          repo,
          topics: repo.repositoryTopics.edges.map(x => x.node.topic.name)
        }))
        .map(({ repo, topics }) => (
          <li key={repo.id}>
            <Repository
              url={repo.url}
              name={repo.name}
              topics={topics}
              onAddTopics={() => {
                const newTopics = prompt(`Enter topics, separated by space`);
                if (!newTopics) {
                  return;
                }
                executeUpdateTopics({
                  id: repo.id,
                  topicNames: topics.concat(validateTopics(newTopics))
                });
              }}
              onRemoveAllTopics={() =>
                executeUpdateTopics({ id: repo.id, topicNames: [] })
              }
              renderTopic={topic => (
                <Topic
                  topic={topic}
                  onRename={() => {
                    const newTopic = prompt(
                      `Enter new name for topic "${topic}"`,
                      topic
                    );
                    if (!newTopic) {
                      return;
                    }
                    executeUpdateTopics({
                      id: repo.id,
                      topicNames: topics.map(x => (x === topic ? newTopic : x))
                    });
                  }}
                  onRemove={() => {
                    executeUpdateTopics({
                      id: repo.id,
                      topicNames: topics.filter(x => x !== topic)
                    });
                  }}
                />
              )}
            />
          </li>
        ))}
    </ul>
  );
};

function PageDashboard(props) {
  if (!props.isAuthorized) {
    return <></>;
  }
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
        <Repos />
      </Wrapper>
    </Layout>
  );
}

PageDashboard.getInitialProps = ctx => {
  const isAuthorized = !!cookies(ctx).token;
  if (!isAuthorized) {
    return auth.redirectToLogin(ctx);
  }
  return { isAuthorized };
};

export default PageDashboard;
