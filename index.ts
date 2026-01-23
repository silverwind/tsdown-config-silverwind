import {fileURLToPath} from "node:url";
import type {UserConfig} from "tsdown";

type CustomConfig = UserConfig & {url: string};

function isObject<T = Record<string, any>>(obj: any): obj is T {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

export function base({url, entry, report, loader, outputOptions, ...other}: CustomConfig): UserConfig {
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
      legalComments: "none",
      codeSplitting: false,
      ...outputOptions,
    },
    fixedExtension: false,
    failOnWarn: true,
    globImport: false,
    ...other,
  } satisfies UserConfig;
}

export function nodeLib({url, entry, ...other}: CustomConfig): UserConfig {
  return base({
    entry,
    platform: "node",
    sourcemap: false,
    minify: false,
    url,
    ...other,
  });
}

export function webLib({url, ...other}: CustomConfig): UserConfig {
  return base({
    platform: "browser",
    target: "esnext",
    sourcemap: true,
    minify: false,
    url,
    ...other,
  });
}

export function nodeCli({url, entry, ...other}: CustomConfig): UserConfig {
  return nodeLib({
    entry,
    platform: "node",
    sourcemap: false,
    minify: true,
    url,
    ...other,
  });
}
