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
 * Plugin to inject environment variables during local development and enable
 * support for Linux's `envsubt` command on the bundle at docker container startup.
 * @param path path to file containing placeholders
 */
function envsubst(path: string): Plugin {
  let isBuild = false;

  /**
   * Creates a separate chunk for the file which we will inject environment variables
   * into at docker container startup, reducing the chance of replacing non-placeholders
   * or breaking the main JavaScript bundle.
   */
  function manualChunks(id: string) {
    if (id.endsWith(path)) {
      // use the modules's filename as the chunk name
      const filename = id.substring(
        id.lastIndexOf("/") + 1,
        id.lastIndexOf(".")
      );

      return filename;
    }
  }

  /**
   * Replaces placeholders of the format `${ENVIRONMENT_VARIABLE_NAME}` with their
   * respective environment variables in local development.
   */
  function transform(code: string, id: string) {
    if (!isBuild && id.endsWith(path)) {
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
  }

  return {
    name: "vite-plugin-envsubst",
    config(_, env) {
      isBuild = env.command === "build";

      return {
        build: {
          rollupOptions: {
            output: {
              manualChunks,
            },
          },
        },
      };
    },
    transform,
  };
}
