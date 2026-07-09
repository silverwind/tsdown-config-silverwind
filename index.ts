import {fileURLToPath} from "node:url";
import type {UserConfig} from "tsdown";

// exact experimental warnings emitted by rolldown-plugin-dts, the first by
// versions before 0.27 which consumers may still use via older tsdown
const suppressedWarnings = new Set([
  "The `tsgo` option is experimental and may change in the future.",
  "TypeScript 7.0 does not yet have a stable API and is experimental. Some options will be unavailable.",
]);

const origWarn = console.warn;
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === "string" && suppressedWarnings.has(args[0])) return;
  origWarn(...args);
};

type CustomConfig = UserConfig & {url: string};

function isObject<T = Record<string, any>>(obj: any): obj is T {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

function isSingleEntry(entry: UserConfig["entry"]) {
  if (Array.isArray(entry)) {
    return entry.length === 1;
  } else if (isObject(entry)) {
    return Object.keys(entry).length === 1;
  } else {
    return true;
  }
}

export function base({url, entry, report, loader, outputOptions, deps, ...other}: CustomConfig): UserConfig {
  return {
    entry: entry ?? fileURLToPath(new URL("index.ts", url)),
    report: typeof report === "boolean" ? report : {
      gzip: false,
      brotli: false,
      ...(isObject(report) && {report}),
    },
    loader: {
      ".svg": "text",
      ".md": "text",
      ".xml": "text",
      ".txt": "text",
      ...loader,
    },
    outputOptions: {
      comments: {legal: false},
      ...(isObject(outputOptions) && outputOptions),
    },
    fixedExtension: false,
    failOnWarn: true,
    globImport: false,
    dts: {tsgo: true},
    deps: {onlyBundle: false, ...deps}, // suppress warning about unintended bundling of dependencies
    ...other,
  } satisfies UserConfig;
}

export function nodeLib({url, entry, outputOptions, ...other}: CustomConfig): UserConfig {
  return base({
    entry,
    platform: "node",
    minify: false,
    outputOptions: {
      ...(isSingleEntry(entry) && {codeSplitting: false}),
      ...(isObject(outputOptions) && outputOptions),
    },
    url,
    ...other,
  });
}

export function webLib({url, ...other}: CustomConfig): UserConfig {
  return base({
    platform: "browser",
    target: "esnext",
    minify: false,
    url,
    ...other,
  });
}

export function nodeCli({url, entry, outputOptions, ...other}: CustomConfig): UserConfig {
  return nodeLib({
    entry,
    platform: "node",
    minify: true,
    outputOptions: {
      ...(isSingleEntry(entry) && {codeSplitting: false}),
      ...(isObject(outputOptions) && outputOptions),
    },
    url,
    ...other,
  });
}
