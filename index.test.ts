import {nodeLib, webLib, nodeCli} from "./index.ts";

test("nodeLib", () => {
  const cfg = nodeLib({url: import.meta.url});
  expect(cfg.platform).toBe("node");
  expect(cfg.checks!.pluginTimings).toBe(false);
  expect(cfg.checks!.moduleLevelDirective).toBe(false);
});

test("webLib", () => {
  expect(webLib({url: import.meta.url}).platform).toBe("browser");
});

test("nodeCli", () => {
  expect(nodeCli({url: import.meta.url}).platform).toBe("node");
});
