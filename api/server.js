const express = require('express');
const app = express();
app.use(express.json());

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3002);
app.locals.title = 'Pot Spot';

app.get('/', (request, response) => {
  response.send('Oh hey Pot Spot');
});

app.get('/api/v1/potholes', async (request, response) => {
  try {
    const potholes = await database('potholes').select();
    response.status(200).json(potholes);
  } catch(error) {
    response.status(500).json({ error });
  }
});

app.get('/api/v1/pictures', async (request, response) => {
  try {
    const pictures = await database('pictures').select('url');
    response.status(200).json(pictures);
  } catch(error) {
    response.status(500).json({ error });
  }
});

app.post('/api/v1/potholes', async (request, response) => {
  const pothole = request.body;
    if(!pothole) {
        return response.status(400).send({ error: `Where's the body?`, request: `${request}`})
    }

  for (let requiredParameter of ['latitude', 'longitude', 'description', 'pictures']) {
    if (!pothole[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { latitude: <String>, longitude: <String>, description: <String>, pictures: <Array> }. You're missing a "${requiredParameter}" property.` });
    }
  }

//   const {latitude, longitude, description} = pothole;

  const createPothole = async (knex, pothole) => {

    const potholeId = await knex('potholes').insert({
      latitude: pothole.latitude,
      longitude: pothole.longitude,
      description: pothole.description
    }, 'id');
  
    let picturePromises = pothole.pictures.map(picture => {
      return createPicture(knex, {
        url: picture,
        pothole_id: potholeId[0].id
      })
    });
  
    return Promise.all(picturePromises);
  };
  
  const createPicture = (knex, picture) => {
    return knex('pictures').insert(picture);
  };

  try {
    const id = await database('potholes').insert({latitude, longitude, description}, 'id');
    // await database('pictures').insert({url: pothole.pictures[0], pothole_id: id[0].id})
    // createPothole(knex, pothole)
    const pics = await database('pictures').insert({latitude, longitude, description}, 'pictures');
    response.status(201).json({ id, pics })
  } catch (error) {
    response.status(500).json({ error });
  }
});


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});