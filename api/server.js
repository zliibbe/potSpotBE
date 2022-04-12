const express = require('express');
const app = express();
app.use(express.json());

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Pot Spot';

app.get('/', (request, response) => {
  response.send('Oh hey Pot Spot');
});

app.get('/api/v1/potholes', async (request, response) => {
  try {
    const potholes = await database('potholes').select();
    response.status(200).json(potholes);
  } catch (error) {
    response.status(500).json({
      error
    });
  }
});

app.get('/api/v1/pictures', async (request, response) => {
  try {
    const pictures = await database('pictures').select('url');
    response.status(200).json(pictures);
  } catch (error) {
    response.status(500).json({
      error
    });
  }
});

app.post('/api/v1/potholes', async (request, response) => {

  const pothole = request.body;

  if (!pothole) {
    return response.status(400).send({
      error: `Where's the body?`,
      request: `${request}`
    })
  }

  for (let requiredParameter of ['latitude', 'longitude', 'description', 'pictures']) {
    if (!pothole[requiredParameter]) {
      return response
        .status(422)
        .send({
          error: `Expected format: { latitude: <String>, longitude: <String>, description: <String>, pictures: <Array> }. You're missing a "${requiredParameter}" property.`
        });
    }
  }

  const createPothole = async (ph) => {

    const potholeId = await database('potholes').insert({
      latitude: ph.latitude,
      longitude: ph.longitude,
      description: ph.description
    }, 'id');

    const pics = Object.values(ph.pictures)
    let id = potholeId;
    let picturePromises = pics.map(picture => {
      return createPicture({
        url: picture,
        pothole_id: potholeId[0].id
      })
    });

    return Promise.all(picturePromises).then(() => {
      return id
    });
  };

  const createPicture = (picture) => {
    return database('pictures').insert(picture);
  };

  try {
    let idPromise = await createPothole(pothole)
    console.log(idPromise[0].id)
    return response.status(201).json({id: idPromise[0].id, message:`Your pothole has been added.`})
  } catch (error) {
    response.status(500).json({
      error: `Your pothole was not added see Error: ${error}`
    });
  }
});


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});
