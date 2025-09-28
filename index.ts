import {realpathSync} from "node:fs";
import {fileURLToPath} from "node:url";
import type {Options} from "tsdown";

export type CustomConfig = Options & {url: string};

const base = ({url, ...other}: CustomConfig): Options => {
  console.info(fileURLToPath(new URL("index.ts", url)));
  console.info(realpathSync("index.ts"));

  return {
    entry: fileURLToPath(new URL("index.ts", url)),
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
