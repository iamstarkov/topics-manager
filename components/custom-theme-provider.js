import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ThemeProvider } from "styled-components";
import * as ducks from "../ducks";

const CustomThemeProvider = ({ isDark, dark, light, children }) => (
  <ThemeProvider theme={isDark ? dark : light}>{children}</ThemeProvider>
);

CustomThemeProvider.propTypes = {
  isDark: ducks.theme.shape.isDark,
  dark: PropTypes.shape().isRequired,
  light: PropTypes.shape().isRequired,
  children: PropTypes.node.isRequired
};

const mapStateToProps = state => ({
  isDark: ducks.theme.selectors.isDark(state)
});

const enhance = connect(mapStateToProps);

export default enhance(CustomThemeProvider);
