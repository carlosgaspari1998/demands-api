const userModel = require('../models/userModel');
const { hashPassword, verifyPassword } = require('../utils/hashUtils');
const jwt = require('jsonwebtoken');
const { generateCustomId } = require('../utils/idUtils');

async function create(req, res) {
  const { name, email, password } = req.body;

  try {
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email já registrado' });
    }

    const id = generateCustomId();
    const hashedPassword = hashPassword(password, id);

    await userModel.createUser({ id, name, email, password: hashedPassword });

    res.status(201).json({ success: true, message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar o usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao registrar o usuário' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Email ou senha inválidos' });
    }

    const isPasswordValid = verifyPassword(password, user.password, user.id);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Email ou senha inválidos' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '5h' });

    res.json({ success: true, token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
}

module.exports = {
  create,
  login,
};
