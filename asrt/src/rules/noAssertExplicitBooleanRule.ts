import * as Lint from "tslint";
import {IRuleMetadata, RuleFailure, WalkContext} from "tslint";
import {BinaryExpression, forEachChild, Node, SourceFile, SyntaxKind} from "typescript";

const ASSERTION_EXPRESSION_NAMES = ['assert', 'always', 'never'];

class Rule extends Lint.Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    ruleName: 'no-assert-explicit-boolean',
    type: 'maintainability',
    description: `Disallows calling always/never/assert with just a boolean.`,
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: `Disallowing passing explicit boolean true or false to the assert() method reduces the amount of false-positives in Stryker Mutator reports.`,
    typescriptOnly: false
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return super.applyWithFunction(sourceFile, walk);
  }
}

function getFailureString(bool) {
  return `Assertions cannot be called with condition argument "${bool}" directly`
}

function walk(context: WalkContext<void>): void {
  return forEachChild(context.sourceFile, callback);

  function callback(node: Node): void {
    if (node.kind >= SyntaxKind.FirstTypeNode && node.kind <= SyntaxKind.LastTypeNode) {
      return;
    }
    if (node.kind === SyntaxKind.CallExpression) {
      // @ts-ignore
      if (ASSERTION_EXPRESSION_NAMES.includes(node.expression.text)) {
        // @ts-ignore
        const conditionArgument = node.arguments[0];
        if (conditionArgument.kind === SyntaxKind.TrueKeyword || conditionArgument.kind === SyntaxKind.FalseKeyword) {
          return context.addFailureAtNode(conditionArgument, getFailureString(conditionArgument.getText()));
        }
        if (conditionArgument.kind === SyntaxKind.BinaryExpression) {
          return walkBinaryExpression(context, conditionArgument);
        }
      }
    }
    return forEachChild(node, callback);
  }
}

function walkBinaryExpression(context: WalkContext<void>, expression: BinaryExpression): void {
  if (expression.operatorToken.kind !== SyntaxKind.EqualsEqualsEqualsToken
    && expression.operatorToken.kind !== SyntaxKind.ExclamationEqualsEqualsToken) {
    [expression.left, expression.right].forEach(side => {
      if (side.kind === SyntaxKind.TrueKeyword || side.kind === SyntaxKind.FalseKeyword) {
        return context.addFailureAtNode(side, getFailureString(side.getText()));
      }
      if (side.kind === SyntaxKind.BinaryExpression) {
        return walkBinaryExpression(context, side as BinaryExpression);
      }
    });
  }
}
