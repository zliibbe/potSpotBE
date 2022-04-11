/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const potholesData = require('../potholesData.js');

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


exports.seed = async (knex) => {
  // Deletes ALL existing entries
  try {
    await knex('pictures').del()
    await knex('potholes').del()

    let potholePromises = potholesData.map(pothole => {
      return createPothole(knex, pothole);
    });

    return Promise.all(potholePromises);

  } catch (error) {
    console.log(`Error seeding data: ${error}`)
  }

};
