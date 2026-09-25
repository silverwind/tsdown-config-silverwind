import {nodeLib, webLib, nodeCli} from "./index.ts";

test("nodeLib", () => {
  const cfg = nodeLib({url: import.meta.url});
  expect(cfg.platform).toBe("node");
  expect(cfg.checks?.pluginTimings).toBe(false);
  expect(cfg.checks?.moduleLevelDirective).toBe(false);
});

test("webLib", () => {
  const cfg = webLib({url: import.meta.url});
  expect(cfg.platform).toBe("browser");
});

test("nodeCli", () => {
  const cfg = nodeCli({url: import.meta.url});
  expect(cfg.platform).toBe("node");
});
