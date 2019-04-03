import PropTypes from "prop-types";

export const ns = "theme";

export const shape = {
  isDark: PropTypes.bool.isRequired
};

export const initialState = {
  isDark: false
};

const root = state => state[ns];
export const selectors = {
  root,
  isDark: state => root(state).isDark
};

export const types = {
  toggle: `${ns} / TOGGLE`
};

const toggle = () => ({
  type: types.toggle
});

export const actions = {
  toggle
};

export const rawReducer = (state = initialState, { type }) => {
  switch (type) {
    case types.toggle:
      return { ...state, isDark: !state.isDark };
    default:
      return state;
  }
};

export const reducer = {
  [ns]: rawReducer
};
