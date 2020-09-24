import {assert} from "./assert";

export class AssertionError extends Error {
  constructor(...messages: ReadonlyArray<string>) {
    assert(messages instanceof Array, 'Parameter "messages" must be an Array.');
    assert(messages.every(m => typeof m === 'string'), 'Parameter "messages" must be an Array of strings.');
    super(messages.join(' '));
    this.name = 'AssertionError';
  }
}
