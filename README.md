# tsdown-config-silverwind [![](https://img.shields.io/npm/v/tsdown-config-silverwind.svg)](https://www.npmjs.org/package/tsdown-config-silverwind) [![](https://img.shields.io/badge/licence-bsd-blue.svg)](https://raw.githubusercontent.com/silverwind/tsdown-config-silverwind/master/LICENSE)

Shared tsdown configuration

```js
import {nodeLib} from "tsdown-config-silverwind";
import {defineConfig} from "tsdown";

export default defineConfig(nodeLib({url: import.meta.url}));
```

© [silverwind](https://github.com/silverwind), distributed under BSD licence.
