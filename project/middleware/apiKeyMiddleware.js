// middleware/apiKeyMiddleware.js

function apiKeyMiddleware(req, res, next) {
  // Get the API key sent in request header 'x-api-key'
  const apiKey = req.header('x-api-key');

  // Hardcoded API key instead of environment variable
  const expectedApiKey = 'abcde';  // <-- your fixed API key here

  // Log incoming request path and API keys for debugging
  console.log(`API key middleware triggered for ${req.method} ${req.originalUrl}`);
  console.log(`Received API key: ${apiKey}`);
  console.log(`Expected API key: ${expectedApiKey}`);

  // If no API key was sent, stop and send an error
  if (!apiKey) {
    console.log('API Key is missing');
    return res.status(401).send('API Key is missing');
  }

  // If API key sent does not match the correct one, stop and send an error
  if (apiKey !== expectedApiKey) {
    console.log('API Key is invalid');
    return res.status(403).send('API Key is invalid');
  }

  // API key is correct, let the request continue
  console.log('API Key is valid - proceeding');
  next();
}

module.exports = apiKeyMiddleware;
