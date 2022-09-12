/*
 * @Author: sunboy
 * @LastEditors: sunboy
 * @Date: 2022-09-11 22:20:25
 * @LastEditTime: 2022-09-11 22:39:44
 */
import { defineConfig } from "vite";
import path from "path";
import types from '@elonehoo/vite-plugin-type-ts'
export default defineConfig({
  plugins: [
    types({
      tsConfigFilePath: './tsconfig.json',
      cleanVueFileName: true,
      insertTypesEntry: true,
    }),
  ],
  build: {
    sourcemap: true,
    // config options
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: "main",
      fileName: "main",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
