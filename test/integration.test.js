const request = require('supertest');
const chai = require('chai');
const fs = require('fs');
const path = require('path');
const app = require('../estimation_server');
chai.should();

const configPath = path.join(__dirname, '..', 'config.json');
const originalConfig = JSON.parse(fs.readFileSync(configPath));

after(() => {
  fs.writeFileSync(configPath, JSON.stringify(originalConfig, null, 2));
});

describe('POST /calculate', () => {
  it('calculates cost for a sample print job', async () => {
    const response = await request(app)
      .post('/calculate')
      .send([
        {
          print_time: 60,
          print_weight: 50,
          pre_time: 15,
          post_time: 20
        }
      ])
      .expect(200);

    const result = response.body[0];
    // expected values from openapi example
    const expected = {
      total_filament_cost: 780,
      total_electricity_bill: 54,
      total_labour_cost: 133.33333333333334,
      total_cost: 1015.7
    };
    for (const key of Object.keys(expected)) {
      if (typeof expected[key] === 'number') {
        // allow small rounding differences
        result[key].should.be.approximately(expected[key], 0.01);
      } else {
        result[key].should.equal(expected[key]);
      }
    }
  });
});

describe('Config endpoints', () => {
  it('retrieves current config', async () => {
    const response = await request(app).get('/config').expect(200);
    response.body.spool_price.should.equal(originalConfig.spool_price);
  });

  it('updates config and persists', async () => {
    const newValue = originalConfig.spool_price + 1000;
    await request(app).post('/config').send({ spool_price: newValue }).expect(200);

    const getRes = await request(app).get('/config').expect(200);
    getRes.body.spool_price.should.equal(newValue);

    const fileValue = JSON.parse(fs.readFileSync(configPath)).spool_price;
    fileValue.should.equal(newValue);
  });
});
