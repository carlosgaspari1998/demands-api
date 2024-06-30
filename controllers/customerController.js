const customerModel = require('../models/customerModel');
const { generateCustomId } = require('../utils/idUtils');

async function getAllCustomers(req, res) {
  try {
    const customers = await customerModel.findAll();
    res.json(customers);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar clientes' });
  }
}

async function getCustomerById(req, res) {
  const customerId = req.params.id;

  try {
    const customer = await customerModel.findById(customerId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Cliente não encontrado' });
    }
    res.json(customer);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar cliente' });
  }
}

async function createCustomer(req, res) {
  const { name, address } = req.body;
  const id = generateCustomId();

  try {
    await customerModel.createCustomer({ id, name, address });
    res.status(201).json({ success: true, message: 'Cliente adicionado com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar um novo cliente:', error);
    res.status(500).json({ success: false, message: 'Erro ao adicionar um novo cliente' });
  }
}

async function updateCustomer(req, res) {
  const customerId = req.params.id;
  const { name, address } = req.body;

  try {
    const result = await customerModel.updateCustomer(customerId, { name, address });
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Cliente não encontrado' });
    }
    res.json({ success: true, message: 'Cliente atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar o cliente:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar o cliente' });
  }
}

async function deleteCustomer(req, res) {
  const customerId = req.params.id;

  try {
    await customerModel.removeCustomer(customerId);
    res.json({ success: true, message: 'cliente removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover o cliente:', error);
    res.status(500).json({ success: false, message: 'Erro ao remover o cliente' });
  }
}

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
