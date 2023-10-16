const express = require('express');
const app = express();
const port = 2000;

app.use(express.json());

app.post('/calculate', (req, res) => {


     printJobs = req.body;

     calculateCost = printJobs.map(
        job=>{
             const { 
                print_time, 
                print_weight, 
                pre_time, 
                post_time,
                spool_price = 13000,    
                print_preparation_rate = 200,
                post_process_rate = 250 } = job;

            
    //   filament spool details
    filament_type = 'PLA';
    spool_weight = 1000;
    spool_spool_weight = 0;
    spool_filament_weight = spool_weight - spool_spool_weight;
    markup_precentage = 1 + (20 / 100);
    price_of_an_unit_filament = (spool_price / spool_filament_weight) * markup_precentage;


    //   3d print details
    print_name = 'test_print';
    total_filament_cost = print_weight * price_of_an_unit_filament;


    // electricity bills
    power_consumptin_of_the_machine = 360;
    avg_energy_cost_of_electricity = 150;
    total_electricity_bill = (print_time) * (power_consumptin_of_the_machine) * avg_energy_cost_of_electricity / 60000;



    // labour cost

    print_preparation_time = pre_time;
    post_process_time = post_time;
    total_labour_cost = (print_preparation_time * print_preparation_rate) + (post_process_rate * post_process_time);
    total_labour_cost /= 60
    
    // machine and upkeep cost
    printer_cost = 96000;
    investment_return = 2;


    // repair cost
    repair_cost_rate = 1 + (5 / 100);


    // total_cost_calculation
    total_cost = total_labour_cost + total_electricity_bill + total_filament_cost;
    total_cost = repair_cost_rate * total_cost;

    return {
        total_filament_cost: total_filament_cost,
        total_electricity_bill: total_electricity_bill,
        total_labour_cost: total_labour_cost,
        total_cost: total_cost,
    };
        }
    );

res.json(calculateCost);

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
