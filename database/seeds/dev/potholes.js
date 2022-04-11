/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  try {
    await knex('pictures').del()
    await knex('potholes').del()



    const potholeId = await knex('potholes').insert([
      {latitude: '39.74379494415912', longitude: '-104.95005172109876', description: 'Decent size'},
      {latitude: '39.74018534594094', longitude: '-104.95724927698312', description: `its a pothole`},
      {latitude: '39.77998918688553', longitude: '-104.97897473238706', description: 'Extra Smelly'}
    ], 'id')
    return knex('pictures').insert([
      {url: 'https://www.attorneystevelee.com/wp-content/uploads/pothole-road1.jpg', pothole_id: potholeId[0].id},
      {url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Large_pot_hole_on_2nd_Avenue_in_New_York_City.JPG/1920px-Large_pot_hole_on_2nd_Avenue_in_New_York_City.JPG', pothole_id: potholeId[0].id},
      {url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Asphalt_deterioration.jpg/1024px-Asphalt_deterioration.jpg', pothole_id: potholeId[1].id},
      {url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Newport_Whitepit_Lane_pot_hole.JPG/1920px-Newport_Whitepit_Lane_pot_hole.JPG', pothole_id: potholeId[2].id},
      {url: 'https://www.thebalance.com/thmb/VlnrT3pRKvtegoumE0fXWmA4pWI=/2121x1193/smart/filters:no_upscale()/pothole-174662203-5a7dc84aae9ab80036c6ad36.jpg', pothole_id: potholeId[2].id}
    ]);
  } catch {

  }

};
