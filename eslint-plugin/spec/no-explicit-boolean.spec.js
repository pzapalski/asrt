const {RuleTester} = require("eslint");
const rule = require('../rules/no-explicit-boolean');

const ruleTester = new RuleTester({
  parser: `${process.cwd()}/node_modules/@typescript-eslint/parser/dist/parser.js`,
  plugins: [
    "@typescript-eslint"
  ],
});

const fnNames = ['assert', 'always', 'never'];

ruleTester.run(
  'no-explicit-boolean',
  rule,
  {
    valid: fnNames.map(name => [
      {
        code: `${name}(condition === true)`,
      },
      {
        code: `${name}(condition === false)`,
      },
      {
        code: `${name}(condition !== true)`,
      },
      {
        code: `${name}(condition !== false)`,
      },
      {
        code: `${name}(something1 === something2, 'test')`,
      },
      {
        code: `${name}(something1 !== something2, 'test')`,
      },
      {
        code: `${name}(!something1, 'test')`,
      },
    ]).flat(1),
    invalid: fnNames.map(name => [
      {
        code: `${name}(true)`,
        errors: [{
          message: 'Assertions cannot be called with condition that is always true',
          line: 1,
          endLine: 1,
          column: name.length + 2,
          endColumn: name.length + 6
        }]
      },
      {
        code: `${name}(false)`,
        errors: [{
          message: 'Assertions cannot be called with condition that is always false',
          line: 1,
          endLine: 1,
          column: name.length + 2,
          endColumn: name.length + 7
        }]
      },
      {
        code: `${name}(true && true)`,
        errors: [{
          message: 'Assertions cannot be called with condition that is always true',
          line: 1,
          endLine: 1,
          column: name.length + 2,
          endColumn: name.length + 6
        }, {
          message: 'Assertions cannot be called with condition that is always true',
          line: 1,
          endLine: 1,
          column: name.length + 10,
          endColumn: name.length + 14
        }]
      },
      {
        code: `${name}(something1 === something2 || true, 'test')`,
        errors: [{
          message: 'Assertions cannot be called with condition that is always true',
          line: 1,
          endLine: 1,
          column: name.length + 31,
          endColumn: name.length + 35
        }]
      },
      {
        code: `${name}(something1 === something2 || false, 'test')`,
        errors: [{
          message: 'Assertions cannot be called with condition that is always false',
          line: 1,
          endLine: 1,
          column: name.length + 31,
          endColumn: name.length + 36
        }]
      },
      {
        code: `${name}(something1 === something2 || 0 < 1 || true, 'test')`,
        errors: [{
          message: 'Assertions cannot be called with condition that is always true',
          line: 1,
          endLine: 1,
          column: name.length + 40,
          endColumn: name.length + 44
        }]
      },
      {
        code: `${name}(something1 === something2 || 0 < 1 || false, 'test')`,
        errors: [{
          message: 'Assertions cannot be called with condition that is always false',
          line: 1,
          endLine: 1,
          column: name.length + 40,
          endColumn: name.length + 45
        }]
      },
    ]).flat(1)
  });
