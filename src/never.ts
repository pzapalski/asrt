import {assert} from "./assert";

export function never(condition: boolean, ...messages: ReadonlyArray<string>): asserts condition is false {
  assert(typeof condition === 'boolean', `Argument 'condition' must be a boolean.`);
  assert(messages instanceof Array, `Argument 'messages' must be be an array.`);
  messages.forEach(message => {
    assert(typeof message === 'string', `Argument 'messages' can only have string values.`);
    assert(message.trim() !== '', `Argument 'messages' can only have non-empty values.`);
  });
  assert(condition === false, ...messages);
}
