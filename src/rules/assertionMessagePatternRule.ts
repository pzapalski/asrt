import * as Lint from "tslint";
import {IRuleMetadata, RuleFailure, WalkContext} from "tslint";
import {CallExpression, Expression, forEachChild, Node, SourceFile, SyntaxKind} from "typescript";
import RandExp = require("randexp");

const ASSERTION_EXPRESSION_NAMES = ['assert', 'always', 'never'];

const DEFAULT_REGEX = /^.*$/;

export class Rule extends Lint.Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    ruleName: 'assertion-message-pattern',
    type: 'maintainability',
    description: `Checks if always(), never(), and assert() messages match a pattern.`,
    options: {
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
    },
    hasFix: true,
    optionsDescription: 'Not configurable.',
    rationale:
      'Enforcing message patterns enables you to, for example, standardize that the second message is an error code '
      + 'which then makes it easier to find buggy code when call stack is unavailable.',
    typescriptOnly: false
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return super.applyWithFunction(sourceFile, walk, this.ruleArguments[0]);
  }
}

function walk(context: WalkContext<any>): void {
  return forEachChild(context.sourceFile, callback);

  function callback(node: Node): void {
    if (node.kind >= SyntaxKind.FirstTypeNode && node.kind <= SyntaxKind.LastTypeNode) {
      return;
    }
    if (node.kind === SyntaxKind.CallExpression) {
      if (ASSERTION_EXPRESSION_NAMES.includes((node as CallExpression).expression.getText())) {
        const patterns = context.options ?? [];
        const args = Array.from((node as CallExpression).arguments);
        const firstArgument = args.shift();
        if (args.length < patterns.length) {
          const lastArgument = args[args.length - 1] ?? firstArgument;
          context.addFailure(
            lastArgument.getEnd(),
            lastArgument.getEnd() + 1,
            getArgumentCountFailureString(patterns.length, args.length)
          )
        }
        args.forEach((arg, index) => {
          const option = patterns[index];
          if (option === false) {
            return;
          }
          const pattern = new RegExp(option) ?? DEFAULT_REGEX;
          if (arg.kind !== SyntaxKind.StringLiteral) {
            return;
          }
          const stringValue = arg.getText().slice(1, -1);
          if (pattern.test(stringValue)) {
            return;
          }
          context.addFailureAt(
            arg.getStart(),
            arg.getWidth(),
            getPatternFailureString(pattern, index + 1),
            fixPatternFailure(arg, pattern)
          );
        });
      }
    }
    return forEachChild(node, callback);
  }
}

function getPatternFailureString(pattern: RegExp, index: number) {
  return `Assertion message ${index} has to match ${pattern}.`
}

function fixPatternFailure(expression: Expression, pattern: RegExp): Lint.Replacement {
  const randExp = new RandExp(pattern);
  const fixedText = randExp.gen();
  const start = expression.getStart();
  const end = expression.getEnd();
  const length = end - start;
  const quoteType = expression.getText()[0];
  return new Lint.Replacement(start, length, `${quoteType}${fixedText}${quoteType}`);
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
