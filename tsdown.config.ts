import {defineConfig} from "tsdown";
import {nodeLib} from "./index.ts";

export default defineConfig(nodeLib({
  url: import.meta.url,
}));
