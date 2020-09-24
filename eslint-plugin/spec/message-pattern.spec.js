// eslint-disable-next-line @typescript-eslint/no-var-requires
const {RuleTester} = require("eslint");
const rule = require('../rules/message-pattern');

const ruleTester = new RuleTester({
  parser: `${process.cwd()}/node_modules/@typescript-eslint/parser/dist/parser.js`,
  plugins: [
    "@typescript-eslint"
  ]
});

const fnNames = ['assert', 'always', 'never'];

ruleTester.run(
  'message-pattern',
  rule,
  {
    valid: fnNames.map(name => [
      {
        code: `${name}(i > 0, "abc", "[abcd-efgh]");`,
        options: [['^abc$', '^\\[abcd-efgh\\]$']],
      },
      {
        code: `${name}(i > 0, "abc", "[abcd-efgh]", "");`,
        options: [['^abc$', '^\\[abcd-efgh\\]$']],
      },
      {
        code: `${name}(i > 0, variable, "[abcd-efgh]", "");`,
        options: [['^abc$', '^\\[abcd-efgh\\]$']],
      }
    ]).flat(1),
    invalid: fnNames.map(name => [
      {
        code: `${name}(i > 0);`,
        options: [['^xyz']],
        errors: [{
          message: 'Expected 1 assertion messages but none were provided.',
          line: 1,
          endLine: 1,
          column: name.length + 7,
          endColumn: name.length + 7
        }],
        output: `${name}(i > 0, "xyz");`
      },
      {
        code: `${name}(i > 0);`,
        options: [['^abc$', '^\\[abcd-efgh\\]$']],
        errors: [{
          message: 'Expected 2 assertion messages but none were provided.',
          line: 1,
          endLine: 1,
          column: name.length + 7,
          endColumn: name.length + 7
        }],
        output: `${name}(i > 0, "abc", "[abcd-efgh]");`
      },
      {
        code: `${name}(i > 0, variable);`,
        options: [['^abc$', '^\\[abcd-efgh\\]$']],
        errors: [{
          message: 'Expected 2 assertion messages but only 1 was provided.',
          line: 1,
          endLine: 1,
          column: name.length + 17,
          endColumn: name.length + 17
        }],
        output: `${name}(i > 0, variable, "[abcd-efgh]");`
      },
      {
        code: `${name}(i > 0, "abc", "");`,
        options: [['^abc$', '^\\[abcd-efgh\\]$']],
        errors: [{
          message: 'Assertion message 2 has to match /^\\[abcd-efgh\\]$/.',
          line: 1,
          endLine: 1,
          column: name.length + 16,
          endColumn: name.length + 18
        }],
        output: `${name}(i > 0, "abc", "[abcd-efgh]");`
      },
      {
        code: `${name}(i > 0, "", "[abcd-efgh]");`,
        options: [['^abc$', '^\\[abcd-efgh\\]$']],
        errors: [{
          message: 'Assertion message 1 has to match /^abc$/.',
          line: 1,
          endLine: 1,
          column: name.length + 9,
          endColumn: name.length + 11
        }],
        output: `${name}(i > 0, "abc", "[abcd-efgh]");`
      },
      {
        code: `${name}(i > 0, "", "");`,
        options: [['^abc$', '^\\[abcd-efgh\\]$']],
        errors: [
          {
            message: 'Assertion message 1 has to match /^abc$/.',
            line: 1,
            endLine: 1,
            column: name.length + 9,
            endColumn: name.length + 11
          },
          {
            message: 'Assertion message 2 has to match /^\\[abcd-efgh\\]$/.',
            line: 1,
            endLine: 1,
            column: name.length + 13,
            endColumn: name.length + 15
          }
        ],
        output: `${name}(i > 0, "abc", "[abcd-efgh]");`
      },
    ]).flat(1)
  });
