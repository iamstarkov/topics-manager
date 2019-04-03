module.exports = {
  extends: ["airbnb", "prettier", "prettier/react"],
  parser: "babel-eslint",
  plugins: ["react"],
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  rules: {
    "react/jsx-filename-extension": 0, 
    "react/destructuring-assignment": 0,
  },
};
