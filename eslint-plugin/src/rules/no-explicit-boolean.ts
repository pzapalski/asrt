import {createRule} from "../internal/create-rule";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {CallExpression, Expression, Literal, LogicalExpression} from "@typescript-eslint/types/dist/ts-estree";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {AST_NODE_TYPES} from "@typescript-eslint/types";

const ASSERTION_EXPRESSION_NAMES = ['assert', 'always', 'never'];

module.exports = createRule({
  name: "no-explicit-boolean",
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallows calling always/never/assert with just a boolean.',
      category: 'Best Practices',
      recommended: 'error'
    },
    messages: {
      bool: "boolean",
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
    }]
  },
  defaultOptions: [[]],
  create: (context) => {
    return {
      CallExpression: (node: CallExpression) => {
        if (ASSERTION_EXPRESSION_NAMES.includes((node.callee as any).name)) {
          const conditionArgument = node.arguments[0];
          if (conditionArgument.type === AST_NODE_TYPES.Literal) {
            return checkLiteral(conditionArgument);
          }
          if (conditionArgument.type === AST_NODE_TYPES.LogicalExpression) {
            return checkLogicalExpression(conditionArgument);
          }
        }

        function checkLiteral(expression: Literal): void {
          const value = expression.value
          if (value === true || value === false) {
            return context.report({
              node: expression,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              message: getFailureString(expression.value)
            });
          }
        }

        function checkLogicalExpression(expression: LogicalExpression): void {
          ['left', 'right'].forEach(sideName => {
            const side: Expression = expression[sideName];
            if (side.type === AST_NODE_TYPES.Literal) {
              checkLiteral(side);
            } else if (side.type === AST_NODE_TYPES.LogicalExpression) {
              checkLogicalExpression(side);
            }
          });
        }

        function getFailureString(bool: boolean): string {
          return `Assertions cannot be called with condition that is always ${bool}`
        }
      }
    }
  }
});

