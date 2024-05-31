function generateCustomId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let customId = '';

  for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      customId += characters.charAt(randomIndex);
  }
  return customId;
}

module.exports = {
  generateCustomId,
};
