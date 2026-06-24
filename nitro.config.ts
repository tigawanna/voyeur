import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "nitro";
import evlog from "evlog/nitro/v3";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

if (!process.env.EVLOG_FS_DIR) {
  process.env.EVLOG_FS_DIR = join(projectRoot, ".evlog", "logs");
}

export default defineConfig({
  experimental: {
    asyncContext: true,
  },
  plugins: ["./server/plugins/evlog-drain.ts"],
  modules: [
    evlog({
      env: { service: "voyeur" },
    }),
  ],
});
