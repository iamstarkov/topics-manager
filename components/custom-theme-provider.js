import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";
import * as ducks from "../ducks";

const CustomThemeProvider = ({ dark, light, children }) => {
  const isDark = useSelector(ducks.theme.selectors.isDark);
  return (
    <ThemeProvider theme={isDark ? dark : light}>{children}</ThemeProvider>
  );
};

CustomThemeProvider.propTypes = {
  dark: PropTypes.shape().isRequired,
  light: PropTypes.shape().isRequired,
  children: PropTypes.node.isRequired
};

export default CustomThemeProvider;
