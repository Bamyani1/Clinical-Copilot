import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => {
  const shouldAnalyzeBundle = process.env.BUNDLE_ANALYZE === "1";

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      ...(shouldAnalyzeBundle
        ? [
            visualizer({
              filename: "stats/bundle.html",
              template: "treemap",
              gzipSize: true,
              brotliSize: true,
            }),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      reportCompressedSize: true,
    },
  };
});
