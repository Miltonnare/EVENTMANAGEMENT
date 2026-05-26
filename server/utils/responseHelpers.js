const sendAuthResponse = (res, statusCode, payload) => res.status(statusCode).json(payload);

const sendMessageResponse = (res, statusCode, message, extra = {}) =>
  res.status(statusCode).json({ message, ...extra });

const sendSuccess = (res, statusCode, payload) =>
  res.status(statusCode).json({ success: true, ...payload });

const sendError = (res, statusCode, error, extra = {}) =>
  res.status(statusCode).json({ success: false, error, ...extra });

const sendData = (res, statusCode, data) => res.status(statusCode).json(data);

module.exports = {
  sendAuthResponse,
  sendMessageResponse,
  sendSuccess,
  sendError,
  sendData,
};
