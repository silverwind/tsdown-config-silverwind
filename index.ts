import {fileURLToPath} from "node:url";
import type {UserConfig} from "tsdown";

export type CustomConfig = {url: string} & UserConfig;

const base = ({url, ...other}: CustomConfig) => ({
  entry: fileURLToPath(new URL("index.ts", url)),
  ...other,
} satisfies UserConfig);

export function nodeLib({url, ...other}: CustomConfig): UserConfig {
  return base({
    platform: "node",
    url,
    ...other,
  });
}
