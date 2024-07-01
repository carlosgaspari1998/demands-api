const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token não fornecido' });
  }

  const jwtToken = token.split(' ')[1];

  jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Falha na autenticação do token' });
    }

    req.userId = decoded.userId;
    next();
  });
}

module.exports = authenticateToken;
