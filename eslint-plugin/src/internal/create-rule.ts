import {ESLintUtils} from '@typescript-eslint/utils';

type ArgumentType<T extends (...args: unknown[]) => unknown> = T extends (args: infer A) => unknown ? A : unknown;
type FirstArgumentType<T extends (...args: unknown[]) => unknown> = T extends (...args: [infer A, ...unknown[]]) => unknown ? A : unknown;

export type InferredRuleFactory = ReturnType<typeof ESLintUtils['RuleCreator']>;
export type InferredRuleContext = FirstArgumentType<InferredRuleConfig['create']>;
export type InferredRuleConfig = ArgumentType<InferredRuleFactory>;

export type RuleListener = ReturnType<InferredRuleConfig['create']>;

export type DefaultRuleOptions = readonly unknown[];
export type RuleContext<O extends DefaultRuleOptions> = InferredRuleContext & { options: O };
export type RuleConfig<O extends DefaultRuleOptions> = {
  readonly name: string,
  readonly meta: InferredRuleConfig['meta'],
  readonly defaultOptions: O,
  readonly create: (context: RuleContext<O>, options: O) => RuleListener
}
export type RuleModule = ReturnType<InferredRuleFactory>;

export function createRule<O extends readonly unknown[]>(ruleConfig: RuleConfig<O>): RuleModule {
  return ESLintUtils.RuleCreator(ruleName => `${ruleName}.com`)(ruleConfig);
}
