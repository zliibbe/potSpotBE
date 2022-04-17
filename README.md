# Pothole Spot API

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

GET `api/v1/potholes` returns all potholes.

GET `api/v1/potholes/:id` will return a single pothole with that id and the picture urls.
