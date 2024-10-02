const express = require('express');
const cors = require('cors');
const axios = require('axios');
const https = require('https');
const fs = require('fs').promises;
const path = require('path');
const app = express();

// Allow all origins
app.use(cors());

// Environment configurations
const envConfig = {
  dev: {
      ssoUrl: 'https://sso.dev-godaddy.com/v1/secure/api/token',
      cert: '/Users/tparsons/Desktop/certs/dify-data.api.authclient.dev-gdcorp.tools.crt',
      key: '/Users/tparsons/Desktop/certs/dify-data.api.authclient.dev-gdcorp.tools.key',
  },
  test: {
      ssoUrl: 'https://sso.test-godaddy.com/v1/secure/api/token',
      cert: '/Users/tparsons/Desktop/certs/dify-data.api.authclient.test-gdcorp.tools.crt',
      key: '/Users/tparsons/Desktop/certs/dify-data.api.authclient.test-gdcorp.tools.key'
  },
  prod: {
      ssoUrl: 'https://sso.godaddy.com/v1/secure/api/token',
      cert: '/Users/tparsons/Desktop/certs/dify-data.api.authclient.gdcorp.tools.key',
      key: '/Users/tparsons/Desktop/certs/dify-data.api.authclient.gdcorp.tools.key'
  }
};

app.use(express.json());

app.post('/get-spaq', async (req, res) => {
    const env = req.query.env || 'dev'; // Default to dev if no env is passed
    const { ssoUrl, cert, key } = envConfig[env];

    console.log(`Generating token for environment: ${env}`);

    const requestBody = { realm: 'cert' };

    try {
        // Read certificate and key files asynchronously
        const [certData, keyData] = await Promise.all([
            fs.readFile(path.resolve(__dirname, cert)),
            fs.readFile(path.resolve(__dirname, key))
        ]);

        const response = await axios.post(ssoUrl, requestBody, {
            headers: {
                'Content-Type': 'application/json',
            },
            httpsAgent: new https.Agent({
                key: keyData,
                cert: certData,
            }),
        });

        const jwtToken = response.data.data;
        console.log(`JWT Token successful at: ${new Date().toISOString()}`, jwtToken);
  
        console.log(' before response2')

        const headers2 = {
          "Content-Type": "application/json",
          "Authorization": `auth_jomax=${jwtToken}`
        };
        
        const payloadData = [{
          "raw": true,
          "metric": "availability",
          "aggregations": [
            "day",
            "poll_id.keyword"
          ],
          "size": 0,
          "filters": [
            {
              "field": "service",
              "value": 4188, // Dify Header
              "type": "term",
              "fieldType": "number"
            },
            {
              "field": "isStaged",
              "value": false,
              "type": "term",
              "fieldType": "boolean"
            }
          ],
          "startAt": "now-1w",
          "endAt": "now"
        },
        {
          "raw": true,
          "metric": "availability",
          "aggregations": [
              "hour",
              "poll_id.keyword"
          ],
          "size": 0,
          "filters": [
              {
                  "field": "service",
                  "value": 4188,
                  "type": "term",
                  "fieldType": "number"
              },
              {
                  "field": "isStaged",
                  "value": false,
                  "type": "term",
                  "fieldType": "boolean"
              }
          ],
          "startAt": "now-24h",
          "endAt": "now"
      }]

      try {
        const responses = await Promise.all(payloadData.map(async (d,i) => {
          return axios.post("https://spaq-api.int.gdcorp.tools/metrics", d, { headers: headers2 })
        }))
        const data = await Promise.all(responses.map(response => {
          return response.data
      }));
      return res.status(200).send(data);
      }
      catch(error) {
        console.error('Error posting data:', error);
      }

        // axios.post("https://spaq-api.int.gdcorp.tools/metrics", data, { headers: headers2 })
        //   .then(response => {
        //     console.log('QQQ', response.data);
        //     return res.status(200).send(response.data);
        //   })
        //   .catch(error => {
        //     console.error("Error making the request:", error);
        //   });
    }
    catch (error) {
        console.error(`Error fetching JWT Token at: ${new Date().toISOString()}`, error.message);
        res.status(500).send({ details: error.message });
    }
});

// Start the server
const port = process.env.PORT || 9099;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
