function loadConfig(app) {

  let config = {
    auth0CallbackUrl: process.env.AUTH0_CALLBACK_URL,
    auth0Id: process.env.AUTH0_CLIENT_ID,
    auth0Secret: process.env.AUTH0_CLIENT_SECRET,
    auth0Domain: process.env.AUTH0_DOMAIN,
    mongoDbUri: process.env.MONGODB_URI,
    paperTrailToken: process.env.PAPERTRAIL_API_TOKEN
  };

  app.get('/config/client', (req, res) => {
    res.json(config);
  });
};

module.exports = { loadConfig: loadConfig };