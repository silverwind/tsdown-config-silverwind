import {nodeLib, webLib, nodeCli} from "./index.ts";

test("nodeLib", () => {
  const cfg = nodeLib({url: import.meta.url});
  expect(cfg.platform).equal("node");
  expect(cfg.checks?.pluginTimings).equal(false);
});

test("webLib", () => {
  const cfg = webLib({url: import.meta.url});
  expect(cfg.platform).equal("browser");
});

test("nodeCli", () => {
  const cfg = nodeCli({url: import.meta.url});
  expect(cfg.platform).equal("node");
});
