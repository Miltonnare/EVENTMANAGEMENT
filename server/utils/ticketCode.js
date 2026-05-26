const crypto = require('crypto');

const generateTicketCode = () => {
  const segment = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `TKT-${segment}-${Date.now().toString(36).toUpperCase().slice(-4)}`;
};

module.exports = { generateTicketCode };
