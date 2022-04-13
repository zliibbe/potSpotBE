const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors({
  allowedOrigins: ['localhost:3000']
}));


// app.use(cors({
//     origin: 'https://www.section.io'
// }));


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
    const pictures = await database('pictures').select('url', 'pothole_id');
    response.status(200).json(pictures);
  } catch (error) {
    response.status(500).json({
      error
    });
  }
});

app.get('/api/v1/potholes/:id', async (request, response) => {
  const { id } = request.params;
  try {
    if(typeof parseInt(id) !== 'number' ||  !parseInt(id)) return response.status(400).send({error: `Expected id to be a number`})
    const potholePromise = await database('potholes').where('id', id).select(['id', 'latitude', 'longitude', 'description']);
    let pothole = potholePromise[0];
    if (!pothole) return response.status(404).send({error: `There is no pothole with that id`})
    let picturePromise = await database('pictures').where('pothole_id', id).select('url');
    pothole.pictures = picturePromise.map(picture => picture.url)
    return response.status(200).json(pothole);

  } catch (error) {
      return response.status(500).json({error })
  }
})




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
    return response.status(201).json({
      id: idPromise[0].id,
      message: `Your pothole has been added.`
    })
  } catch (error) {
    response.status(500).json({
      error: `Your pothole was not added see Error: ${error}`
    });
  }
});


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});


