import {mkdtemp, readFile, rm} from "node:fs/promises";
import {createRequire} from "node:module";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {fileURLToPath, pathToFileURL} from "node:url";
import type * as tsdown from "tsdown";
import {nodeLib, webLib, nodeCli} from "./index.ts";

const url = import.meta.url;
const urlWithoutTypescript = pathToFileURL("/without-typescript/index.ts").href;

test("nodeLib", async () => {
  expect(nodeLib({url})).toMatchObject({platform: "node", checks: {pluginTimings: false, moduleLevelDirective: false}});
  expect(nodeLib({url, dts: false}).dts).toBe(false);
  expect(nodeLib({url: urlWithoutTypescript, dts: {dtsOnly: true}}).dts).toEqual({generator: "oxc", emitJs: false, dtsOnly: true});
  expect(nodeLib({url: urlWithoutTypescript}).dts).toEqual({generator: "oxc", emitJs: false});
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

test("builds declarations on TypeScript 6, 7.0 and 7.1, keeping untyped dependencies external", async () => {
  const outDir = await mkdtemp(join(tmpdir(), "tsdown-config-silverwind-"));
  try {
    for (const [fixture, generator] of [["ts6", "tsc"], ["ts7", "oxc"], ["ts71", "tsgo"]]) {
      const fixtureUrl = new URL(`fixtures/${fixture}/`, import.meta.url);
      const config = nodeLib({
        url: fixtureUrl.href,
        entry: "index.ts",
        cwd: fileURLToPath(new URL("fixtures/", import.meta.url)),
        outDir: join(outDir, fixture),
        logLevel: "silent",
      });
      expect(config.dts).toMatchObject({generator});
      const {build}: typeof tsdown = await import(pathToFileURL(createRequire(fixtureUrl).resolve("tsdown")).href);
      await build({...config, config: false});
      expect(await readFile(join(outDir, fixture, "index.d.ts"), "utf8")).toBe(`import pluralize from "pluralize";
export declare function plural(word: string): string;
export { pluralize };`);
    }
  } finally {
    await rm(outDir, {recursive: true});
  }
});

test("webLib", () => {
  expect(webLib({url}).platform).toBe("browser");
});

test("nodeCli", () => {
  expect(nodeCli({url})).toMatchObject({platform: "node", dts: false});
});
