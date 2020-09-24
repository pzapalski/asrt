const {assert} = require("../assert");

describe(`Assert:`, () => {
  describe(`assert()`, () => {
    it(`doesn't throw when true`, () => {
      expect(() => assert(true)).not.toThrow();
    });
    it(`throws when false`, () => {
      expect(() => assert(false)).toThrow();
    });
    it(`complains when given an empty message.`, () => {
      expect(() => assert(false, ''))
        .toThrowError(/message/gi);
      expect(() => assert(false, 'test message', ''))
        .toThrowError(/message/gi);
    });
    it(`complains when given wrong argument types.`, () => {
      expect(() => assert(0)).toThrowError(/condition/gi);
      expect(() => assert(false, 0)).toThrowError(/message/gi);
      expect(() => assert(false, 'test message', 0)).toThrowError(/message/gi);
    });
    it(`throws a default message when given none.`, () => {
      expect(() => assert(false)).toThrowError(/condition/gi);
    });
    it(`throws specified messages.`, () => {
      const messages = ['test', 'error', 'messages'];
      expect(() => assert(false, ...messages))
        .toThrowMatching(thrown => {
          return messages.map(m => new RegExp(m).test(thrown)).every(m => m === true)
        });
    });
  });
});
