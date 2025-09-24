import {nodeLib} from "./index.ts";

test("nodeLib", () => {
  const cfg = nodeLib({url: import.meta.url});
  expect(cfg.platform).equal("node");
});
