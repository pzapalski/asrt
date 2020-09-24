# asrt

A small library to verify preconditions and postconditions.

## Usage

```javascript
import {always} from 'asrt';

function add(x, y) {
    always(typeof x === 'number', "Argument 'x' has to be a number.");
    always(typeof y === 'number', "Argument 'y' has to be a number.");
    return x + y;
}
```

always() and assert() functions throw an AssertionError if the condition is false:
```typescript
always(1 > 0); // ok
always(1 < 0); // throws AssertionError
```

never() does the same but in reverse:
```typescript
never(1 > 0); // throws AssertionError
never(1 < 0); // ok
```

### TypeScript

Asrt functions always() and assert() are typed to assert that the condition you pass them are true, which gives you certainty that your variable is of a given type at runtime. 

```typescript
export declare function always(condition: boolean, ...messages: ReadonlyArray<string>): asserts condition;
```

```typescript
const x: unknown = someUntypedFunction();
always(typeof x === 'string');
const y = x.toUpperCase(); // TypeScript knows that x must be a string, your IDE can suggest toUpperCase() method
```
