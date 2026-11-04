import {mkdir, mkdtemp, rm, writeFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {pathToFileURL} from "node:url";
import {nodeLib, webLib, nodeCli} from "./index.ts";

const url = import.meta.url;
const urlWithoutTypescript = "file:///without-typescript/index.ts";

test("nodeLib", async () => {
  expect(nodeLib({url})).toMatchObject({platform: "node", checks: {pluginTimings: false, moduleLevelDirective: false}});
  expect(nodeLib({url, dts: false}).dts).toBe(false);
  expect(nodeLib({url: urlWithoutTypescript, dts: {emitDtsOnly: true}}).dts).toEqual({generator: "oxc", emitDtsOnly: true});
  expect(nodeLib({url: urlWithoutTypescript}).dts).toEqual({generator: "oxc"});
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

test("dts generator follows the installed TypeScript version", async () => {
  const dir = await mkdtemp(join(tmpdir(), "tsdown-config-silverwind-"));
  try {
    for (const [version, generator] of [["6.0.3", "tsc"], ["7.0.2", "oxc"], ["7.1.0-beta", "tsgo"], ["7.1.0-dev.20261104.1", "tsgo"], ["7.1.0", "tsgo"], ["8.0.0", "tsgo"]]) {
      const project = join(dir, version);
      await mkdir(join(project, "node_modules/typescript"), {recursive: true});
      await writeFile(join(project, "node_modules/typescript/package.json"), JSON.stringify({version}));
      expect(nodeLib({url: pathToFileURL(join(project, "index.ts")).href}).dts).toEqual({generator});
    }
  } finally {
    await rm(dir, {recursive: true});
  }
});

test("webLib", () => {
  expect(webLib({url}).platform).toBe("browser");
});

test("nodeCli", () => {
  expect(nodeCli({url}).platform).toBe("node");
});
