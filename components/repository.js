import React from "react";
import PropTypes from "prop-types";
import { ButtonAddTopics, ButtonRemoveAllTopics } from "./buttons";

const Repository = ({
  url,
  name,
  topics,
  onAddTopics,
  onRemoveAllTopics,
  renderTopic
}) => (
  <>
    <a href={url}>{name}</a> <ButtonAddTopics onClick={onAddTopics} />
    {topics.length !== 0 && (
      <ul>
        {topics.map(topic => (
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
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  topics: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAddTopics: PropTypes.func.isRequired,
  onRemoveAllTopics: PropTypes.func.isRequired,
  renderTopic: PropTypes.func.isRequired
};

export default Repository;
