import React from "react";
import PropTypes from "prop-types";
import { ButtonRename, ButtonDelete } from "./buttons";

const Topic = ({ topic, onRename, onDelete }) => (
  <>
    <ButtonRename onClick={onRename} />
    {` ${topic} `}
    <ButtonDelete onClick={onDelete} />
  </>
);

Topic.propTypes = {
  topic: PropTypes.string.isRequired,
  onRename: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default Topic;
