const {always} = require("../always");

describe(`Assert always:`, () => {
  describe(`always()`, () => {
    it(`doesn't throw when true`, () => {
      expect(() => always(true)).not.toThrow();
    });
    it(`throws when false`, () => {
      expect(() => always(false)).toThrow();
    });
    it(`complains when given an empty message.`, () => {
      expect(() => always(false, ''))
        .toThrowError(/message/gi);
      expect(() => always(false, 'test message', ''))
        .toThrowError(/message/gi);
    });
    it(`complains when given wrong argument types.`, () => {
      expect(() => always(0)).toThrowError(/condition/gi);
      expect(() => always(false, 0)).toThrowError(/message/gi);
      expect(() => always(false, 'test message', 0)).toThrowError(/message/gi);
    });
    it(`throws a default message when given none.`, () => {
      expect(() => always(false)).toThrowError(/condition/gi);
    });
    it(`throws specified messages.`, () => {
      const messages = ['test', 'error', 'messages'];
      expect(() => always(false, ...messages))
        .toThrowMatching(thrown => {
          return messages.map(m => new RegExp(m).test(thrown)).every(m => m === true)
        });
    });
  });
});
