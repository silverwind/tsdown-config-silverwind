import {nodeLib, webLib, nodeCli} from "./index.ts";

const url = import.meta.url;

test("nodeLib", async () => {
  expect(nodeLib({url})).toMatchObject({platform: "node", checks: {pluginTimings: false, moduleLevelDirective: false}});
  expect(nodeLib({url, report: "ci-only"}).report).toBe("ci-only");
  const {outputOptions} = nodeLib({url, outputOptions: options => ({...options, banner: "x"})});
  expect(typeof outputOptions === "function" && await outputOptions({}, "es", {cjsDts: false})).toEqual({
    comments: {legal: false},
    codeSplitting: false,
    banner: "x",
  });
  for (const entry of ["src/*.ts", "src/{a,b}.ts", ["src/[ab].ts"], [{a: "a.ts", b: "b.ts"}], {"*": "src/*.ts"}]) {
    expect(nodeLib({url, entry}).outputOptions).not.toHaveProperty("codeSplitting");
  }
});

test("webLib", () => {
  expect(webLib({url}).platform).toBe("browser");
});

test("nodeCli", () => {
  expect(nodeCli({url}).platform).toBe("node");
});
