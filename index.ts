import {fileURLToPath} from "node:url";
import {platform} from "node:os";
import type {Options} from "tsdown";

export type CustomConfig = Options & {url: string};

const base = ({url, ...other}: CustomConfig): Options => {
  // entry is a glob pattern and tsdown does not accept backslashes on windows for it
  // https://github.com/rolldown/tsdown/issues/518
  let entry = fileURLToPath(new URL("index.ts", url));
  if (platform() === "win32") {
    entry = entry.replaceAll("\\", "/");
  }

  return {
    entry,
    report: {
      gzip: false,
      brotli: false,
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
