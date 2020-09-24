import {ESLintUtils} from "@typescript-eslint/experimental-utils";

type ArgumentType<T extends (...args: any) => any> = T extends (args: infer A) => any ? A : any;
type FirstArgumentType<T extends (...args: any) => any> = T extends (...args: [infer A, ...any[]]) => any ? A : any;

export type InferredRuleFactory = ReturnType<typeof ESLintUtils.RuleCreator>;
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
