# tsdown-config-silverwind
[![](https://img.shields.io/npm/v/tsdown-config-silverwind.svg)](https://www.npmjs.org/package/tsdown-config-silverwind) [![](https://packagephobia.com/badge?p=tsdown-config-silverwind)](https://packagephobia.com/result?p=tsdown-config-silverwind)

> Shared tsdown configuration

## Usage

```sh
pnpm add -D tsdown-config-silverwind
```

In `tsdown.config.ts`:

```ts
import {nodeLib} from "tsdown-config-silverwind";
import {defineConfig} from "tsdown";

export default defineConfig(nodeLib({url: import.meta.url}));
```

© [silverwind](https://github.com/silverwind), distributed under BSD licence
