# Topics Manager

> Serverless App to manage GitHub repos' topics

## General pre-requisites

1. [Node.JS 10+ LTS](https://nodejs.org/en/)
2. [Yarn](https://yarnpkg.com/en/)

## Local development pre-requisites

1. [Register a new OAuth application](https://github.com/settings/applications/new)
2. Fill anything in all the fields
3. But set callback url as `http://localhost:3000/auth/github/callback`
4. Hit "Register application"
5. Copy `Client ID` and `Client Secret`
6. Add `Client ID` as `TOPICS_MANAGER_GITHUB_CLIENT_ID` env variable
6. Add `Client Secret` as `TOPICS_MANAGER_GITHUB_CLIENT_SECRET` env variable

## Getting started

```
git clone git@github.com:iamstarkov/topics-manager.git
cd topics-manager
yarn
```
### Available scripts

* `yarn dev` to run local next.js server
* `yarn test` to run tests
* `yarn format` to format source code
* `yarn lint` to lint source code
* `yarn validate` to run `yarn lint` and `yarn test` together, used for `pre-push` git hook

## Developer Experience stack

* Babel for transpiling
* Jest for tests
* Prettier for stylistic formatting
* Eslint for non-stylistic linting
* Lint-staged for formatting and linting and staged files
* Husky for consistent git hooks 

## General Tech stack

* next.js—framework for isomorphic react apps
* react—framework for predictable UIs
* redux—state management library
* styled-components—styling library

## Integrations

* [Renovate](https://renovatebot.com) to update to new dependencies' versions for performance/security reasons
* [Travis CI](https://travis-ci.com) to validate every pull-request
* [Now Cloud](https://now.sh) to automatically deploy every pull-request in its own staging environment and commits to master to production

## License

MIT © [Vladimir Starkov](https://iamstarkov.com/)
