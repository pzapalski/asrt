import {AST_NODE_TYPES} from '@typescript-eslint/experimental-utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {CallExpression, Expression} from "@typescript-eslint/types/dist/ts-estree";
import {createRule} from "../internal/create-rule";
import RandExp = require("randexp");

type Options = [ReadonlyArray<string | false>];

module.exports = createRule<Options>({
  name: 'message-pattern',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Checks if always(), never(), and assert() messages match a pattern.',
      category: 'Best Practices',
      recommended: 'error'
    },
    messages: {
      missing: "missing",
      mismatch: "mismatch"
    },
    schema: [{
      type: 'array',
      items: {
        oneOf: [
          {
            type: 'string'
          },
          {
            const: false
          }
        ]
      }
    }],
    fixable: "code"
  },
  defaultOptions: [[]],
  create: (context, [options]) => {
    const ASSERTION_EXPRESSION_NAMES = ['assert', 'always', 'never'];
    const DEFAULT_REGEX = /^.*$/;

    return {
      CallExpression: (node: CallExpression) => {
        if (ASSERTION_EXPRESSION_NAMES.includes((node.callee as any).name)) {
          const patterns = options ?? [];
          const args = [...node.arguments];
          const firstArgument = args.shift();
          if (args.length < patterns.length) {
            const lastArgument = args[args.length - 1] ?? firstArgument;
            const numberOfMissingArgs = patterns.length - args.length;
            const missingPatterns = patterns.slice(patterns.length - numberOfMissingArgs);
            context.report({
              loc: {
                start: {
                  line: lastArgument.loc.end.line,
                  column: lastArgument.loc.end.column
                },
                end: {
                  line: lastArgument.loc.end.line,
                  column: lastArgument.loc.end.column
                }
              },
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              message: getArgumentCountFailureString(patterns.length, args.length),
              fix: fixer => fixer.insertTextAfter(lastArgument, getFixArgumentCountFailure(missingPatterns))
            });
          }
          args.forEach((arg, index) => {
            const option = patterns[index];
            if (option === false) {
              return;
            }
            const pattern = new RegExp(option) ?? DEFAULT_REGEX;
            if (arg.type !== AST_NODE_TYPES.Literal) {
              return;
            }
            const stringValue = context.getSourceCode().getText(arg).slice(1, -1);
            if (pattern.test(stringValue)) {
              return;
            }
            context.report({
              node: arg,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              message: getPatternFailureString(pattern, index + 1),
              fix: fixer => fixer.replaceText(arg, getFixPatternFailure(arg, pattern))
            });
          });
        }
      }
    }

    function getPatternFailureString(pattern: RegExp, index: number) {
      return `Assertion message ${index} has to match ${pattern}.`;
    }

    function getArgumentCountFailureString(expected: number, provided: number) {
      if (provided === 0) {
        return `Expected ${expected} assertion messages but none were provided.`;
      }
      if (provided === 1) {
        return `Expected ${expected} assertion messages but only ${provided} was provided.`;
      }
      return `Expected ${expected} assertion messages but only ${provided} were provided.`;
    }

    function getFixPatternFailure(arg: Expression, pattern: RegExp): string {
      const randExp = new RandExp(pattern);
      const fix = randExp.gen();
      const text = context.getSourceCode().getText(arg);
      const quoteType = text[0];
      return `${quoteType}${fix}${quoteType}`;
    }

    function getFixArgumentCountFailure(patterns: ReadonlyArray<string | false>): string {
      const fixes = patterns.map((pattern) => {
        if (pattern === false) {
          return `""`;
        }
        const randExp = new RandExp(pattern);
        return `"${randExp.gen()}"`;
      });
      return ', ' + fixes.join(', ');
    }
  }
});
