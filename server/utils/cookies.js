const config = require('../config');

const refreshCookieOptions = {
  httpOnly: true,
  secure: config.cookies.secure,
  sameSite: config.cookies.sameSite,
  maxAge: config.cookies.refreshMaxAge,
  path: config.cookies.path,
};

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie(config.cookies.refreshName, refreshToken, refreshCookieOptions);
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie(config.cookies.refreshName, {
    httpOnly: true,
    secure: config.cookies.secure,
    sameSite: config.cookies.sameSite,
    path: config.cookies.path,
  });
};

module.exports = { setRefreshTokenCookie, clearRefreshTokenCookie };
