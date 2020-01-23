import {AssertionError} from "./assertion-error";

export function assert(condition: boolean, ...messages: ReadonlyArray<string>): asserts condition {
  if (typeof condition !== 'boolean') {
    throw new TypeError(`Argument 'condition' must be be a boolean.`);
  }
  if (!(messages instanceof Array)) {
    throw new TypeError(`Argument 'messages' must be be an array.`);
  }
  messages.forEach(message => {
    if (typeof message !== 'string') {
      throw new TypeError(`Argument "messages" can only have string values.`);
    }
    if (message.trim() === '') {
      throw new TypeError(`Argument "messages" cannot have empty messages.`);
    }
  });
  if (messages.length === 0) {
    messages.push('Condition was expected to always be true.');
  }
  if (condition !== true) {
    throw new AssertionError(...messages);
  }
};
