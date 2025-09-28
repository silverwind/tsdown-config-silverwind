import {defineConfig} from "tsdown";
import {nodeLib} from "./index.ts";

export default defineConfig(nodeLib({
  url: import.meta.url,
  entry: "index.ts", // https://github.com/rolldown/tsdown/issues/518
}));
