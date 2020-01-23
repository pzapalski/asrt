module.exports = function (config) {
  config.set({
    mutator: "typescript",
    packageManager: "npm",
    reporters: ["html", "clear-text", "progress"],
    testRunner: "jasmine",
    transpilers: ["typescript"],
    testFramework: "jasmine",
    coverageAnalysis: "perTestInIsolation",
    jasmineConfigFile: "spec/support/jasmine.json",
    tsconfigFile: "tsconfig.json",
    mutate: [
      "src/**/*.ts",
      "!src/rules/**/*.ts",
      "!src/assertion-error.ts"
    ],
  });
};
