const authValidators = require('./auth.validator');
const eventValidators = require('./event.validator');
const registrationValidators = require('./registration.validator');

module.exports = {
  ...authValidators,
  ...eventValidators,
  ...registrationValidators,
};
