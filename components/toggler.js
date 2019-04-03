import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as ducks from "../ducks";

const Toggler = ({ toggle, isDark }) => (
  <button type="button" onClick={toggle}>
    Toggle to {isDark ? "light" : "dark"} theme
  </button>
);

Toggler.propTypes = {
  toggle: PropTypes.func.isRequired,
  isDark: ducks.theme.shape.isDark
};

const mapStateToProps = state => ({
  isDark: ducks.theme.selectors.isDark(state)
});

const mapDispatchToProps = {
  toggle: ducks.theme.actions.toggle
};

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default enhance(Toggler);
