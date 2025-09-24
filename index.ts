import {fileURLToPath} from "node:url";
import type {Options} from "tsdown";

export type CustomConfig = {url: string} & Options;

const base = ({url, ...other}: CustomConfig): Options => ({
  entry: fileURLToPath(new URL("index.ts", url)),
  ...other,
} satisfies Options);

export function nodeLib({url, ...other}: CustomConfig): Options {
  return base({
    platform: "node",
    url,
    ...other,
  });
}
