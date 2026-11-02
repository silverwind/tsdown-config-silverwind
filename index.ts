import {createRequire} from "node:module";
import {fileURLToPath} from "node:url";
import type {Rolldown, UserConfig} from "tsdown";

type CustomConfig = UserConfig & {url: string};

function isObject(obj: any): obj is Record<string, any> {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

function mergeOutputOptions(defaults: Rolldown.OutputOptions, outputOptions: UserConfig["outputOptions"]): UserConfig["outputOptions"] {
  if (typeof outputOptions === "function") {
    return (options, ...args) => outputOptions(Object.assign(options, defaults), ...args);
  } else {
    return {...defaults, ...(isObject(outputOptions) && outputOptions)};
  }
}

function isSingleEntry(entry: UserConfig["entry"]): boolean {
  if (Array.isArray(entry)) {
    return entry.length === 1 && isSingleEntry(entry[0]);
  } else if (isObject(entry)) {
    const keys = Object.keys(entry);
    return keys.length === 1 && !keys[0].includes("*");
  } else {
    return typeof entry !== "string" || !/[*?(]|\[.*\]|\{[^}]*(?:,|\.\.)/.test(entry); // approximates tinyglobby's isDynamicPattern, which tsdown uses to expand entries
  }
}

function hasTypescriptApi(url: string): boolean {
  try {
    return Number.parseInt(createRequire(url)("typescript/package.json").version) < 7;
  } catch {
    return false;
  }
}

export function base({url, entry, report, loader, outputOptions, deps, checks, dts, ...other}: CustomConfig): UserConfig {
  return {
    entry: entry ?? fileURLToPath(new URL("index.ts", url)),
    report: typeof report === "boolean" || typeof report === "string" ? report : {
      gzip: false,
      brotli: false,
      ...(isObject(report) && report),
    },
    loader: {
      ".svg": "text",
      ".md": "text",
      ".xml": "text",
      ".txt": "text",
      ...loader,
    },
    outputOptions: mergeOutputOptions({comments: {legal: false}}, outputOptions),
    fixedExtension: false,
    failOnWarn: true,
    checks: {pluginTimings: false, moduleLevelDirective: false, ...checks}, // "use client" in deps, https://github.com/rolldown/rolldown/issues/7809
    globImport: false,
    dts: dts !== false && {generator: hasTypescriptApi(url) ? "tsc" : "oxc", ...(isObject(dts) && dts)}, // oxc needs isolatedDeclarations-compatible code, tsc needs TypeScript 6 or below
    deps: {onlyBundle: false, ...deps}, // suppress hint about unintended bundling of dependencies
    ...other,
  };
}

export function nodeLib({url, entry, outputOptions, ...other}: CustomConfig): UserConfig {
  return base({
    entry,
    platform: "node",
    minify: false,
    outputOptions: mergeOutputOptions(isSingleEntry(entry) ? {codeSplitting: false} : {}, outputOptions),
    url,
    ...other,
  });
}

export function webLib(config: CustomConfig): UserConfig {
  return base({
    platform: "browser",
    target: "esnext",
    minify: false,
    ...config,
  });
}

export function nodeCli(config: CustomConfig): UserConfig {
  return nodeLib({minify: true, ...config});
}
