process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, database} = require('../api/server.js');

const expect = chai.expect;

chai.use(chaiHttp)


describe('Pot Spot API routes!', () => {

  beforeEach(function(done) {
    database.migrate.rollback()
    .then(function() {
      database.migrate.latest()
      .then(function() {
        return database.seed.run()
        .then(function() {
          done();
        });
      });
    });
  });

  afterEach(function(done) {
    database.migrate.rollback()
      .then(function() {
        done();
      })
    });


  it('should return all potholes @ /api/v1/potholes', () => {
    chai.request(app)
      .get('/api/v1/potholes')
      .end((req, res) => {
        expect(res.status).to.be.eql(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.eql(3);
        expect(res.body[0]).to.have.property('id');
        expect(res.body[0].id).to.eql(1)
        expect(res.body[0]).to.have.property('latitude');
        expect(res.body[0].latitude).to.eql('39.74379494415912');
        expect(res.body[0]).to.have.property('longitude');
        expect(res.body[0].longitude).to.eql('-104.95005172109876');
        expect(res.body[0]).to.have.property('description');
        expect(res.body[0].description).to.eql('Decent size');
        expect(res.body[0]).to.have.property('created_at');
        expect(res.body[0]).to.have.property('updated_at');
      })
  })
})
