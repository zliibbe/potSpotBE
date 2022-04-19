# Pothole Spot API

Welcome to PotSpot API where you can use our lovely endpoint to track all the potholes in your municipality.
To see the Front end of this project go [here](https://github.com/Romeslayer/potSpotFE)

## Setup

The Pot Spot API is currently deployed [here](https://pot-spot.herokuapp.com/)

If you would like to run the application locally you would need:

1.  Clone down the Repo
2.  `cd` into the directory
3.  Run `npm i` to install all dependencies
4. Create a database in Postgresql named potholes and ensure its running.
5. Run command `knex migrate:latest` to update the schema in potholes.
6. Run command `knex seed:run` to populate potholes database with three entries.
7. Now that the tables are populated we can start the api with `nodemon api/server.js` from the root directory.

If you follow along with the steps above you will be able to access the multiple endpoints to display and create potholes at `http://localhost:3000/`


## Endpoints

| Method | Endpoint | Request Body | Sample Response |
--- | --- | --- | ---
`GET` | `'/api/v1/potholes'` | n/a | `[{id: 1, latitude: '', longitude: '', description: '', created_at: '', updated_at: ''}, ...]`
`GET` | `'/api/v1/potholes/:id'` | n/a | `{id: 1, latitude: '', longitude: '', description: '', pictures: ['', ...]}`
`GET` | `'/picutres'` | n/a | `[{id: 1, url: '', pothole_id: ''}, ...]`
`POST` | `'/api/v1/potholes'` | `{latitude: '39.7392', longitude: '-104.9903', description: 'Craterous hole', pictures:['https://example.com']}` | `{id: 2, message: 'Your pothole has been added'}`
`DELETE` | `'api/v1/potholes/:id'` | n/a | `{id: 2, message: 'Your pothole at id: 2 has been deleted'}`


## Goals

- Learn an implement fundamentals of building a Database and API application
- Create multiple endpoints to CREATE READ and DELETE potholes
- Implement knex data base with migrations and seeds
- Implement Express.js to build out API


## Authors

- DéNaje Ferguson - [GitHub](https://github.com/Romeslayer)
- Jake Dunafon - [GitHub](https://github.com/J-Dunny)
- Ron L Head - [GitHub](https://github.com/RonLHead)
