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



  it('should return all the photos @ /api/v1/pictures', () => {
    chai.request(app)
      .get('/api/v1/pictures')
      .end((req, res) => {
        expect(res.status).to.be.eql(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.eql(5);
        expect(res.body[0].url).to.be.eql('https://www.attorneystevelee.com/wp-content/uploads/pothole-road1.jpg');
        expect(res.body[0].pothole_id).to.be.eql(1);
      })
  })


  it('should return pothole and pictures @ /api/v1/potholes/:id', () => {
    chai.request(app)
    .get('/api/v1/potholes/1')
    .end((req, res) => {
      expect(res.status).to.be.eql(200);
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('id');
      expect(res.body.id).to.be.eql(1);
      expect(res.body).to.have.property('latitude');
      expect(res.body.latitude).to.be.eql('39.74379494415912');
      expect(res.body).to.have.property('longitude');
      expect(res.body.longitude).to.be.eql('-104.95005172109876');
      expect(res.body).to.have.property('description');
      expect(res.body.description).to.be.eql('Decent size')
      expect(res.body).to.have.property('pictures');
      expect(res.body.pictures).to.be.an('array');
      expect(res.body.pictures.length).to.be.eql(2);
    })
  })

  it('should return a different pothole and pictures @ /api/v1/potholes/:id', () => {
    chai.request(app)
    .get('/api/v1/potholes/2')
    .end((req, res) => {
      expect(res.status).to.be.eql(200);
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('id');
      expect(res.body.id).to.be.eql(2);
      expect(res.body).to.have.property('latitude');
      expect(res.body.latitude).to.be.eql('39.74018534594094');
      expect(res.body).to.have.property('longitude');
      expect(res.body.longitude).to.be.eql('-104.95724927698312');
      expect(res.body).to.have.property('description');
      expect(res.body.description).to.be.eql('its a pothole')
      expect(res.body).to.have.property('pictures');
      expect(res.body.pictures).to.be.an('array');
      expect(res.body.pictures.length).to.be.eql(1);
    })
  })

  it('should return an error if id is not a number @ /api/v1/potholes/:id', () => {
    chai.request(app)
    .get('/api/v1/potholes/apples')
    .end((req, res) => {
      expect(res.status).to.be.eql(400)
      expect(res.body).to.be.eql({error: `Expected id to be a number`});
    })
  })

  it('should return an error if there is no pothole with that id @ /api/v1/potholes/:id', () => {
    chai.request(app)
      .get('/api/v1/potholes/13')
      .end((req, res) => {
        expect(res.status).to.be.eql(404)
        expect(res.body).to.be.eql({error: 'There is no pothole with that id'})
      })
  })
})
