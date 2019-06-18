// fix for forgotten yarn installs on branch switches
// https://youtu.be/ikn_dBSski8?list=PLCC436JpVnK3kcTnPyhcs7QnHK2PKl33D&t=802
const runYarnLock = "yarn install --frozen-lockfile";

module.exports = {
  hooks: {
    "post-checkout": `if [[ $HUSKY_GIT_PARAMS =~ 1$ ]]; then ${runYarnLock}; fi`,
    "post-merge": runYarnLock,
    "post-rebase": "yarn install",
    "pre-commit": "lint-staged",
    "pre-push": "yarn run validate"
  }
};
