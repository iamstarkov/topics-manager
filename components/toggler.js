import React from "react";
import { bindActionCreators } from "redux";
import { useSelector, useDispatch } from "react-redux";
import * as ducks from "../ducks";

const Toggler = () => {
  const dispatch = useDispatch();
  const isDark = useSelector(ducks.theme.selectors.isDark);
  const toggle = bindActionCreators(ducks.theme.actions.toggle, dispatch);
  return (
    <button type="button" onClick={toggle}>
      Toggle to {isDark ? "light" : "dark"} theme
    </button>
  );
};

export default Toggler;
