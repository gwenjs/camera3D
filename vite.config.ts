import { defineConfig } from 'vite'
import { dirname, resolve } from 'node:path'
import dts from 'vite-plugin-dts'
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    dts({
      include: ["src"],
      outDir: "dist",
      rollupTypes: false,
      entryRoot: "src",
      pathsToAliases: false,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        module: resolve(__dirname, "src/module.ts"),
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        "@gwenjs/core",
        "@gwenjs/kit",
        /^@gwenjs\/.*/
      ],
    },
  },
});
