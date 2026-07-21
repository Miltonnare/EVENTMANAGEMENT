const sendAuthResponse = (res, statusCode, payload) =>
  res.status(statusCode).json({ success: true, ...payload });

const sendMessageResponse = (res, statusCode, message, extra = {}) => {
  const isSuccess = statusCode >= 200 && statusCode < 400;
  return res.status(statusCode).json({
    success: isSuccess,
    message,
    ...extra,
  });
};

const sendSuccess = (res, statusCode, payload = {}) => {
  if (typeof payload === 'string') {
    return res.status(statusCode).json({ success: true, message: payload });
  }
  return res.status(statusCode).json({ success: true, ...payload });
};

const sendError = (res, statusCode, message, extra = {}) =>
  res.status(statusCode).json({
    success: false,
    message: typeof message === 'string' ? message : 'An error occurred',
    error: typeof message === 'string' ? message : message,
    ...extra,
  });

const sendData = (res, statusCode, data, meta = {}) => {
  if (Array.isArray(data)) {
    return res.status(statusCode).json({ success: true, data, ...meta });
  }
  if (data && typeof data === 'object') {
    return res.status(statusCode).json({ success: true, data, ...data, ...meta });
  }
  return res.status(statusCode).json({ success: true, data, ...meta });
};

module.exports = {
  sendAuthResponse,
  sendMessageResponse,
  sendSuccess,
  sendError,
  sendData,
};

