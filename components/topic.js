import React from "react";
import PropTypes from "prop-types";
import { ButtonRename, ButtonRemove } from "./buttons";

const Topic = ({ topic, onRename, onRemove }) => (
  <>
    <ButtonRename onClick={onRename} />
    {` ${topic} `}
    <ButtonRemove onClick={onRemove} />
  </>
);

Topic.propTypes = {
  topic: PropTypes.string.isRequired,
  onRename: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default Topic;
