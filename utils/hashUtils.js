const crypto = require('crypto');

function hashPassword(password, userId) {
  return crypto.createHash('sha256').update(userId + password).digest('hex');
}

function verifyPassword(password, hashedPassword, userId) {
  const hashedAttempt = hashPassword(password, userId);
  return hashedAttempt === hashedPassword;
}

module.exports = {
  hashPassword,
  verifyPassword,
};
