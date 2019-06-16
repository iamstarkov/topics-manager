import api from "./api";

const reload = () => window.location.reload();

const removeTopic = (token, repo, topics, topic) => {
  return api.preview.put(`/repos/${repo.full_name}/topics`, token, {
    names: topics.names.filter(x => x !== topic)
  });
};

const removeAllTopics = (token, repo) => {
  return api.preview.put(`/repos/${repo.full_name}/topics`, token, {
    names: []
  });
};

const renameTopic = (token, repo, topics, oldTopic, newTopic = "") => {
  return api.preview.put(`/repos/${repo.full_name}/topics`, token, {
    names: topics.names.map(x => (x === oldTopic ? newTopic : x))
  });
};

const addTopics = (token, repo, topics, newTopics = []) => {
  return api.preview.put(`/repos/${repo.full_name}/topics`, token, {
    names: topics.names.concat(newTopics)
  });
};

const createHandlers = token => ({
  removeTopic: (...args) => () => {
    removeTopic(token, ...args).then(reload);
  },
  removeAllTopics: (...args) => () => {
    removeAllTopics(token, ...args).then(reload);
  },
  renameTopic: (repo, topics, oldTopic) => () => {
    const newTopic = prompt(`Enter new name for topic "${oldTopic}"`, oldTopic);
    if (!newTopic) {
      return;
    }
    renameTopic(token, repo, topics, oldTopic, newTopic).then(reload);
  },
  addTopics: (repo, topics) => () => {
    const rawNewTopics = prompt(`Enter topics, separated by space`);
    if (!rawNewTopics) {
      return;
    }
    const newTopics = rawNewTopics
      .split(" ")
      .map(x => x.trim())
      .filter(Boolean);
    addTopics(token, repo, topics, newTopics).then(reload);
  }
});

export default createHandlers;
