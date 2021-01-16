const { removeLastCharacter } = require('./utils');

describe('removeLastCharacter', () => {
  it('should remove the last character of the string', () => {
    expect(removeLastCharacter('users')).toBe('user');
  });
});
