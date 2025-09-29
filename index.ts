import {fileURLToPath} from "node:url";
import {platform} from "node:os";
import type {Options} from "tsdown";

export type CustomConfig = Options & {url: string};

function isObject(obj: any): boolean {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

// entry is a glob pattern and tsdown does not accept backslashes on windows for it
// https://github.com/rolldown/tsdown/issues/518
function fixWindowsPath(entry: string): string {
  return entry.replaceAll("\\", "/");
}

function fixEntry(entry: Options["entry"]): Options["entry"] {
  if (platform() !== "win32") return entry;
  if (typeof entry === "string") {
    return fixWindowsPath(entry);
  } else if (Array.isArray(entry)) {
    return entry.map(entry => fixWindowsPath(entry));
  } else if (isObject(entry)) {
    return Object.fromEntries(Object.entries(entry).map(([key, value]) => {
      return [key, fixWindowsPath(value)];
    }));
  } else {
    return entry;
  }
}

const base = ({url, entry, report, loader, outputOptions, ...other}: CustomConfig): Options => {
  // entry is a glob pattern and tsdown does not accept backslashes on windows for it
  // https://github.com/rolldown/tsdown/issues/518
  return {
    entry: fixEntry(entry ?? fileURLToPath(new URL("index.ts", url))),
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
      ...outputOptions,
    },
    ...other,
  } satisfies Options;
};

export function nodeLib({url, ...other}: CustomConfig): Options {
  return base({
    platform: "node",
    url,
    ...other,
  });
}

export function webLib({url, ...other}: CustomConfig): Options {
  return base({
    platform: "browser",
    url,
    ...other,
  });
}

export function nodeCli({url, ...other}: CustomConfig): Options {
  return nodeLib({
    platform: "node",
    url,
    ...other,
  });
}
