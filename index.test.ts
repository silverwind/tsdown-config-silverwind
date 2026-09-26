import {nodeLib, webLib, nodeCli} from "./index.ts";

test("nodeLib", async () => {
  const cfg = nodeLib({url: import.meta.url});
  expect(cfg.platform).toBe("node");
  expect(cfg.checks!.pluginTimings).toBe(false);
  expect(cfg.checks!.moduleLevelDirective).toBe(false);
  expect(nodeLib({url: import.meta.url, report: "ci-only"}).report).toBe("ci-only");
  const {outputOptions} = nodeLib({url: import.meta.url, outputOptions: options => ({...options, banner: "x"})});
  expect(typeof outputOptions === "function" && await outputOptions({}, "es", {cjsDts: false})).toEqual({
    comments: {legal: false},
    codeSplitting: false,
    banner: "x",
  });
});

test("webLib", () => {
  expect(webLib({url: import.meta.url}).platform).toBe("browser");
});

test("nodeCli", () => {
  expect(nodeCli({url: import.meta.url}).platform).toBe("node");
});
