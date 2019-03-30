module.exports = {
  target: 'serverless',
  env: {
    TOPICS_MANAGER_GITHUB_CLIENT_ID: process.env.TOPICS_MANAGER_GITHUB_CLIENT_SECRET
  }
}
