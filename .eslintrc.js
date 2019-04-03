module.exports = {
  extends: ["airbnb", "prettier", "prettier/react"],
  parser: "babel-eslint",
  plugins: ["react"],
  env: {
    node: true,
    browser: true,
    es6: true,
    jest: true
  },
  rules: {
    "react/jsx-filename-extension": 0,
    "react/destructuring-assignment": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "react/require-default-props": 0,
    "import/prefer-default-export": 0,
    "react/prop-types": 1,
    "no-alert": 0
  }
};
