const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '..', 'config.json');

let config = load();

function load() {
  try {
    const text = fs.readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(text);
  } catch (err) {
    const defaults = {
      spool_price: 13000,
      print_preparation_rate: 200,
      post_process_rate: 250,
      spool_weight: 1000,
      spool_spool_weight: 0,
      power_consumption_of_the_machine: 360,
      avg_energy_cost_of_electricity: 150,
      markup_percentage: 20,
      repair_cost_percentage: 5
    };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(defaults, null, 2));
    return defaults;
  }
}

function save() {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

function getConfig() {
  return config;
}

function updateConfig(values) {
  config = { ...config, ...values };
  save();
  return config;
}

module.exports = {
  getConfig,
  updateConfig
};
