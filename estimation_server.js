const express = require('express');
const calculateJobCost = require('./lib/costCalculator');
const { getConfig, updateConfig } = require('./lib/config');

const app = express();
const port = process.env.PORT || 2000;

app.use(express.json());

app.post('/calculate', (req, res) => {
  const jobs = Array.isArray(req.body) ? req.body : [req.body];
  const results = jobs.map(calculateJobCost);
  res.json(results);
});

app.get('/config', (req, res) => {
  res.json(getConfig());
});

app.post('/config', (req, res) => {
  const updated = updateConfig(req.body);
  res.json(updated);
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
