import React from "react";
import PropTypes from "prop-types";
import { ButtonAddTopics, ButtonRemoveAllTopics } from "./buttons";

const Repository = ({
  repo,
  topics,
  onAddTopics,
  onRemoveAllTopics,
  renderTopic
}) => (
  <>
    <a href={repo.html_url}>{repo.name}</a>{" "}
    <ButtonAddTopics onClick={onAddTopics} />
    {topics.names.length !== 0 && (
      <ul>
        {topics.names.map(topic => (
          <li key={topic}>{renderTopic(topic)}</li>
        ))}
        <li key="remove-all">
          <ButtonRemoveAllTopics onClick={onRemoveAllTopics} />
        </li>
      </ul>
    )}
  </>
);

Repository.propTypes = {
  repo: PropTypes.shape().isRequired,
  topics: PropTypes.shape().isRequired,
  onAddTopics: PropTypes.func.isRequired,
  onRemoveAllTopics: PropTypes.func.isRequired,
  renderTopic: PropTypes.func.isRequired
};

export default Repository;
