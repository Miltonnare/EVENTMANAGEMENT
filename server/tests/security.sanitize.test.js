const { sanitizeObject } = require('../config/security');

describe('Security sanitization', () => {
  it('removes mongo operators from nested objects', () => {
    const input = {
      name: 'Test',
      $where: 'this.password.length > 0',
      profile: {
        $ne: 'admin',
        bio: 'hello',
      },
      tags: [{ $gt: 1 }, { label: 'safe' }],
    };

    const sanitized = sanitizeObject(input);

    expect(sanitized).toEqual({
      name: 'Test',
      profile: { bio: 'hello' },
      tags: [{}, { label: 'safe' }],
    });
  });

  it('returns primitives untouched', () => {
    expect(sanitizeObject('safe')).toBe('safe');
    expect(sanitizeObject(42)).toBe(42);
    expect(sanitizeObject(null)).toBeNull();
  });
});
