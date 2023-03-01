// <getDependencies>
// Express.js app server
import express from 'express';
import 'isomorphic-fetch';
import { sortJson, prettyJson } from './sortJson.js';
// </getDependencies>

// <create>
export const create = async () => {
  // Create express app
  const app = express();
  console.log('backend server.js create app');

  // Get root
  app.get('/debug', async (req, res) => {
    console.log('backend server.js /debug requested');

    res.send(
      prettyJson(
        sortJson({
          route: 'debug',
          headers: sortJson(req.headers),
          env: sortJson(process.env),
        })
      )
    );
  });

  // Get Profile and return to client
  app.get('/get-profile', async (req, res) => {
    console.log('backend server.js /get-profile requested');

    try {

      const fakeProfile = {
        "displayName": "John Doe",

        // return true if we have an access token
        "withAuthentication": false
      }

      const bearerToken = req.headers['Authorization'] || req.headers['authorization'];
      console.log(`backend server.js bearerToken: ${bearerToken}`);

      if (bearerToken) {
        const accessToken = bearerToken.split(' ')[1];
        console.log(`backend server.js accessToken: ${accessToken}`);

        fakeProfile.withAuthentication = true;

        // get profile from Graph API
        // provided in next article in this series

      }

      const dataToReturn = {
        route: '/profile success',
        profile: fakeProfile,
        headers: req.headers,
        bearerToken,
        env: process.env,
        error: null,
      }
      console.log(`backend server.js profile: ${JSON.stringify(fakeProfile)}`)

      return res.status(200).json(dataToReturn);

    } catch (err) {
      const dataToReturn = {
        error: {
          route: '/profile error',
          profile: 'error',
          server_response: err,
          message: err.message,
        },
      }
      console.log(`backend server.js err message: ${err.message}`)
      return res.status(200).json(dataToReturn);
    }
  });

  // instead of 404 - just return home page
  app.get('*', (req, res) => {
    res.json({ status: 'unknown url request' });
  });

  return app;
};
// </create>
