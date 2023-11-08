import path from "path";
import "dotenv/config";
import { defineConfig, Plugin } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
  plugins: [preact(), envsubst("src/config.ts")],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
  },
});

/**
 * Replaces placeholders of the format `${ENVIRONMENT_VARIABLE_NAME}` with their
 * respective environment variables in local development. Uses Linux's `envsubt`
 * placeholder format as we use `envsubt` to inject environment variables into
 * the bundle at Docker image startup.
 * @param path file path to inject environment variables into
 */
function envsubst(path: string): Plugin {
  return {
    name: "vite-plugin-envsubst",
    apply: "serve",
    transform(code, id) {
      if (id.endsWith(path)) {
        const placeholders = code.matchAll(/\${([0-9A-Z_]+)}/g);

        for (const [placeholder, variable] of placeholders) {
          const value = process.env[variable];

          if (!value) {
            throw new Error(`Environment variable '${variable}' not found.`);
          }

          code = code.replace(placeholder, value);
        }

        return { code };
      }
    },
  };
}
