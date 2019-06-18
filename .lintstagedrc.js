module.exports = {
  "*.js": [
    "eslint . --fix",
    "prettier --write",
    "git add",
    "jest --bail --findRelatedTests"
  ]
};
