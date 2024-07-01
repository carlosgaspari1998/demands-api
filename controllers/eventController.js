const eventModel = require('../models/eventModel');

async function getAllEvents(req, res) {
  try {
    const events = await eventModel.findAll();
    res.json(events);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar eventos' });
  }
}

module.exports = {
  getAllEvents
};
