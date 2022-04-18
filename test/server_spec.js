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
    const testPic1 = {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Asphalt_deterioration.jpg/1024px-Asphalt_deterioration.jpg',
      pothole_id: 2
    }

    const testPic2 = {
      url: 'https://www.thebalance.com/thmb/VlnrT3pRKvtegoumE0fXWmA4pWI=/2121x1193/smart/filters:no_upscale()/pothole-174662203-5a7dc84aae9ab80036c6ad36.jpg',
      pothole_id: 3
    }

    const testPic3 = {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Newport_Whitepit_Lane_pot_hole.JPG/1920px-Newport_Whitepit_Lane_pot_hole.JPG',
      pothole_id: 3
    }

    chai.request(app)
      .get('/api/v1/pictures')
      .end((req, res) => {
        console.log(res.body);
        expect(res.status).to.be.eql(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.eql(5);
        expect(res.body[0].url).to.be.eql('https://www.attorneystevelee.com/wp-content/uploads/pothole-road1.jpg');
        expect(res.body[0].pothole_id).to.be.eql(1);
      })
  })
})
