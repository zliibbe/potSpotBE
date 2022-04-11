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

  let id;

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

  const {latitude, longitude, description} = pothole;

  const createPothole = async (ph) => {

    const potholeId = await database('potholes').insert({
      latitude: ph.latitude,
      longitude: ph.longitude,
      description: ph.description
    }, 'id');

    const pics = Object.values(ph.pictures)
    id = potholeId;
    console.log(typeof pics);
    // const pics = JSON.parse(`${ph.pictures}`)
    // console.log(pics)


    let picturePromises = pics.map(picture => {
      console.log(picture);
      return createPicture({
        url: picture,
        pothole_id: potholeId[0].id
      })
    });

    return Promise.all(picturePromises);
  };

  const createPicture = (picture) => {
    return database('pictures').insert(picture);
  };

  try {
    // const id = await database('potholes').insert({latitude, longitude, description}, 'id');
    // const picturePromises = pothole.pictures.map(picture => {
    //   knex('pictures').insert({url: picture, pothole_id: id})
    // });
    // Promise.all(picturePromises)
    createPothole(pothole)
    return response.status(201).json({ id })
  } catch (error) {
    response.status(500).json({error: `Ya done goofed ${error}`});
  }
});


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});
