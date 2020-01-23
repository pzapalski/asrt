const {never} = require("../never");

describe(`Assert never:`, () => {
  describe(`never()`, () => {
    it(`doesn't throw when false`, () => {
      expect(() => never(false)).not.toThrow();
    });
    it(`throws when true`, () => {
      expect(() => never(true)).toThrow();
    });
    it(`complains when given an empty message.`, () => {
      expect(() => never(true, ''))
        .toThrowError(/message/gi);
      expect(() => never(true, 'test message', ''))
        .toThrowError(/message/gi);
    });
    it(`complains when given wrong argument types.`, () => {
      expect(() => never(0)).toThrowError(/condition/gi);
      expect(() => never(true, 0)).toThrowError(/message/gi);
      expect(() => never(true, 'test message', 0)).toThrowError(/message/gi);
    });
    it(`throws a default message when given none.`, () => {
      expect(() => never(true)).toThrowError(/condition/gi);
    });
    it(`throws specified messages.`, () => {
      const messages = ['test', 'error', 'messages'];
      expect(() => never(true, ...messages))
        .toThrowMatching(thrown => {
          return messages.map(m => new RegExp(m).test(thrown)).every(m => m === true)
        });
    });
  });
});
