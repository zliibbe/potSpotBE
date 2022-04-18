process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  app,
  database
} = require('../api/server.js');

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


  it('should GET all potholes @ /api/v1/potholes', () => {
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



  it('should GET all the photos @ /api/v1/pictures', () => {
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


  it('should GET pothole and pictures @ /api/v1/potholes/:id', () => {
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
        expect(res.body.description).to.be.eql('Decent size');
        expect(res.body).to.have.property('pictures');
        expect(res.body.pictures).to.be.an('array');
        expect(res.body.pictures.length).to.be.eql(2);
      })
  })

  it('should GET a different pothole and pictures @ /api/v1/potholes/:id', () => {
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
        expect(res.body.description).to.be.eql('its a pothole');
        expect(res.body).to.have.property('pictures');
        expect(res.body.pictures).to.be.an('array');
        expect(res.body.pictures.length).to.be.eql(1);
      })
  })

  it('should GET an error if id is not a number @ /api/v1/potholes/:id', () => {
    chai.request(app)
      .get('/api/v1/potholes/apples')
      .end((req, res) => {
        expect(res.status).to.be.eql(400);
        expect(res.body).to.be.eql({
          error: `Expected id to be a number`
        });
      })
  })

  it('should GET an error if there is no pothole with that id @ /api/v1/potholes/:id', () => {
    chai.request(app)
      .get('/api/v1/potholes/13')
      .end((req, res) => {
        expect(res.status).to.be.eql(404);
        expect(res.body).to.be.eql({
          error: 'There is no pothole with that id'
        });
      })
  })

  it('should be able to POST a new pothole @ /api/v1/potholes', () => {
    const pothole = {
      latitude: '39.718340823336526',
      longitude: '-104.95930176118789',
      description: 'Crater',
      pictures: [
        'https://image.ajunews.com/content/image/2020/08/20/20200820095218510482.jpg',
        'https://media.wtol.com/assets/WTOL/images/e0cab1f8-daeb-4b1d-addb-9ae68f6fcbf3/e0cab1f8-daeb-4b1d-addb-9ae68f6fcbf3_1920x1080.jpg'
      ]
    };

    chai.request(app)
      .post('/api/v1/potholes/')
      .send(pothole)
      .end((req, res) => {
        expect(res.status).to.be.eql(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id');
        expect(res.body.id).to.be.eql(4);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.eql('Your pothole has been added.');
      })
  })


  it('POST request @ /api/v1/potholes should check that there is all required parameters', () => {
    chai.request(app)
      .post('/api/v1/potholes/')
      .send(null)
      .end((req, res) => {
        expect(res.status).to.be.eql(422);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eql(`Expected format: { latitude: <String>, longitude: <String>, description: <String>, pictures: <Array> }. You're missing a "latitude" property.`);
      })

    chai.request(app)
      .post('/api/v1/potholes/')
      .send({
        latitude: '39.718340823336526',
      })
      .end((req, res) => {
        expect(res.status).to.be.eql(422);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eql(`Expected format: { latitude: <String>, longitude: <String>, description: <String>, pictures: <Array> }. You're missing a "longitude" property.`);
      })

    chai.request(app)
      .post('/api/v1/potholes/')
      .send({
        latitude: '39.718340823336526',
        longitude: '-104.95930176118789'
      })
      .end((req, res) => {
        expect(res.status).to.be.eql(422);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eql(`Expected format: { latitude: <String>, longitude: <String>, description: <String>, pictures: <Array> }. You're missing a "description" property.`);
      })

    chai.request(app)
      .post('/api/v1/potholes/')
      .send({
        latitude: '39.718340823336526',
        longitude: '-104.95930176118789',
        description: 'Crater'
      })
      .end((req, res) => {
        expect(res.status).to.be.eql(422);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eql(`Expected format: { latitude: <String>, longitude: <String>, description: <String>, pictures: <Array> }. You're missing a "pictures" property.`);
      })
  })

  it('should be able to DELETE a pothole by id @ /api/v1/potholes/:id', () => {
    chai.request(app)
      .delete('/api/v1/potholes/3')
      .end((req, res) => {
        expect(res.status).to.be.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id');
        expect(res.body.id).to.eql('3')
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.eql('Your pothole at id: 3 has been deleted')
      })
  })

  it('DELETE @ api/v1/potholes/:id id should always be a number', () => {
    chai.request(app)
      .delete('/api/v1/potholes/a')
      .end((req, res) => {
        expect(res.status).to.be.eql(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eql('Expected id to be a number instead got a');
      })
  })
})
