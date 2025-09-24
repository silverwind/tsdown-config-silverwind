import {nodeLib} from "./index.ts";

test("nodeLib", () => {
  expect(nodeLib({url: import.meta.url})).toMatchInlineSnapshot(`
    {
      "entry": "/Users/silverwind/git/tsdown-config-silverwind/index.ts",
      "platform": "node",
    }
  `);
});
