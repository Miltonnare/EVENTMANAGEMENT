const Session = require('../models/Session');
const { hashToken, generateSecureToken } = require('../utils/crypto');
const config = require('../config');

const createSession = async (userId, meta = {}) => {
  const refreshToken = generateSecureToken();
  const expiresAt = new Date(Date.now() + config.auth.refreshMaxAgeMs);

  const session = await Session.create({
    user: userId,
    refreshTokenHash: hashToken(refreshToken),
    expiresAt,
    userAgent: meta.userAgent,
    ipAddress: meta.ipAddress,
  });

  return { session, refreshToken };
};

const findValidSession = async (refreshToken) => {
  const refreshTokenHash = hashToken(refreshToken);
  const session = await Session.findOne({
    refreshTokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });

  return session;
};

const revokeSession = async (sessionId) => {
  await Session.findByIdAndUpdate(sessionId, { revokedAt: new Date() });
};

const revokeSessionByToken = async (refreshToken) => {
  const session = await findValidSession(refreshToken);
  if (session) {
    await revokeSession(session._id);
  }
  return session;
};

const revokeAllUserSessions = async (userId) => {
  await Session.updateMany(
    { user: userId, revokedAt: null },
    { revokedAt: new Date() }
  );
};

const rotateSession = async (oldSession, meta = {}) => {
  await revokeSession(oldSession._id);
  return createSession(oldSession.user, meta);
};

module.exports = {
  createSession,
  findValidSession,
  revokeSession,
  revokeSessionByToken,
  revokeAllUserSessions,
  rotateSession,
};
