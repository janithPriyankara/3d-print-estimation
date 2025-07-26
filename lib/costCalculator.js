const { getConfig } = require('./config');

function calculateJobCost(job) {
  const { print_time, print_weight, pre_time, post_time } = job;
  const cfg = getConfig();

  const spool_filament_weight = cfg.spool_weight - cfg.spool_spool_weight;
  const price_per_unit_filament =
    (cfg.spool_price / spool_filament_weight) *
    (1 + cfg.markup_percentage / 100);

  const total_filament_cost = print_weight * price_per_unit_filament;

  const total_electricity_bill =
    (print_time * cfg.power_consumption_of_the_machine * cfg.avg_energy_cost_of_electricity) /
    60000;

  const total_labour_cost =
    (pre_time * cfg.print_preparation_rate + post_time * cfg.post_process_rate) / 60;

  const repair_cost_rate = 1 + cfg.repair_cost_percentage / 100;
  let total_cost =
    total_labour_cost + total_electricity_bill + total_filament_cost;
  total_cost *= repair_cost_rate;

  return {
    total_filament_cost,
    total_electricity_bill,
    total_labour_cost,
    total_cost,
  };
}

module.exports = calculateJobCost;
