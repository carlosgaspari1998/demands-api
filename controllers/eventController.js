const eventModel = require('../models/eventModel');

async function getAllEvents(req, res) {
  try {
    const customers = await eventModel.findAll();
    res.json(customers);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar clientes' });
  }
}

module.exports = {
  getAllEvents
};
