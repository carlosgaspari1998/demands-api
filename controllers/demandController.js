const demandModel = require('../models/demandModel');
const { generateCustomId } = require('../utils/idUtils');

async function getAllDemands(req, res) {
  try {
    const demands = await demandModel.findAll(req.query.showOnlyNotFinalized);
    res.json(demands);
  } catch (error) {
    console.error('Erro ao buscar Pedidos:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar pedidos' });
  }
}

async function getDemandById(req, res) {
  const demandId = req.params.id;

  try {
    const demand = await demandModel.findById(demandId);
    if (!demand) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado' });
    }
    res.json(demand);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar pedido' });
  }
}

async function createDemand(req, res) {
  const { customer, description, demandTime } = req.body;
  const id = generateCustomId();
  const userId = req.userId;

  try {
    await demandModel.createDemand({ id, customer, description, demandTime, userId });
    res.status(201).json({ success: true, message: 'Pedido adicionado com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar um novo pedido:', error);
    res.status(500).json({ success: false, message: 'Erro ao adicionar um novo pedido' });
  }
}

async function updateDemand(req, res) {
  const demandId = req.params.id;
  const { customer, description, demandTime } = req.body;
  const userId = req.userId;

  try {
    const result = await demandModel.updateDemand(demandId, { customer, description, demandTime, userId});
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado' });
    }
    res.json({ success: true, message: 'Pedido atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar o pedido:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar o pedido' });
  }
}

async function deleteDemand(req, res) {
  const demandId = req.params.id;
  const userId = req.userId;

  try {
    await demandModel.removeDemand(demandId, userId);
    res.json({ success: true, message: 'Pedido removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover o pedido:', error);
    res.status(500).json({ success: false, message: 'Erro ao remover o pedido' });
  }
}

async function finishedDemand(req, res) {
  const demandId = req.params.id;
  const userId = req.userId;

  try {
    const result = await demandModel.finishedDemand(demandId, userId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado' });
    }
    res.json({ success: true, message: 'Pedido atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar o pedido:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar o pedido' });
  }
}

module.exports = {
  getAllDemands,
  getDemandById,
  createDemand,
  updateDemand,
  deleteDemand,
  finishedDemand,
};
