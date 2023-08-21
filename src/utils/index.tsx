export function parseEnv(key: string): string {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`Environment variable '${key}' is required`);
  }

  return value;
}
