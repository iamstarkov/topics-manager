import React from "react";
import PropTypes from "prop-types";

const propTypes = {
  onClick: PropTypes.func.isRequired
};

export const ButtonRename = ({ onClick }) => (
  <button title="rename" type="button" onClick={onClick}>
    ✎
  </button>
);
ButtonRename.propTypes = propTypes;

export const ButtonRemove = ({ onClick }) => (
  <button title="remove" type="button" onClick={onClick}>
    ╳
  </button>
);
ButtonRemove.propTypes = propTypes;

export const ButtonAddTopics = ({ onClick }) => (
  <button title="add topics" type="button" onClick={onClick}>
    +
  </button>
);
ButtonAddTopics.propTypes = propTypes;

export const ButtonRemoveAllTopics = ({ onClick }) => (
  <button title="remove all topics" type="button" onClick={onClick}>
    ⚠ remove all topics
  </button>
);
ButtonRemoveAllTopics.propTypes = propTypes;
