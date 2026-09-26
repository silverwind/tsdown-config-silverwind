import {fileURLToPath} from "node:url";
import type {UserConfig} from "tsdown";

const suppressWarnings = ["TypeScript 7.0 does not yet have a stable API"]; // experimental tsgo warning from rolldown-plugin-dts, fatal under failOnWarn

type CustomConfig = UserConfig & {url: string};

function isObject(obj: any): obj is Record<string, any> {
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

export function base({url, entry, report, loader, outputOptions, deps, checks, ...other}: CustomConfig): UserConfig {
  return {
    entry: entry ?? fileURLToPath(new URL("index.ts", url)),
    report: typeof report === "boolean" ? report : {
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
    outputOptions: {
      comments: {legal: false},
      ...(isObject(outputOptions) && outputOptions),
    },
    fixedExtension: false,
    failOnWarn: true,
    suppressWarnings,
    checks: {pluginTimings: false, moduleLevelDirective: false, ...checks}, // "use client" in deps, https://github.com/rolldown/rolldown/issues/7809
    globImport: false,
    dts: {generator: "tsgo"},
    deps: {onlyBundle: false, ...deps}, // suppress hint about unintended bundling of dependencies
    ...other,
  };
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
