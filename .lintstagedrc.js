module.exports = {
  "*.js": [
    "prettier --write",
    "eslint --fix",
    "git add",
    "jest --bail --findRelatedTests"
  ]
};
