const productModel = require('../models/productModel');
const { generateCustomId } = require('../utils/idUtils');

async function getAllProducts(req, res) {
  try {
    const products = await productModel.findAll();
    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar produtos' });
  }
}

async function getProductById(req, res) {
  const productId = req.params.id;

  try {
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    }
    res.json(product);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar produto' });
  }
}

async function createProduct(req, res) {
  const { name, description } = req.body;
  const id = generateCustomId();

  try {
    await productModel.createProduct({ id, name, description });
    res.status(201).json({ success: true, message: 'Produto adicionado com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar um novo produto:', error);
    res.status(500).json({ success: false, message: 'Erro ao adicionar um novo produto' });
  }
}

async function updateProduct(req, res) {
  const productId = req.params.id;
  const { name, description } = req.body;

  try {
    const result = await productModel.updateProduct(productId, { name, description });
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    }
    res.json({ success: true, message: 'Produto atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar o produto:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar o produto' });
  }
}

async function deleteProduct(req, res) {
  const productId = req.params.id;

  try {
    await productModel.removeProduct(productId);
    res.json({ success: true, message: 'Produto removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover o produto:', error);
    res.status(500).json({ success: false, message: 'Erro ao remover o produto' });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
