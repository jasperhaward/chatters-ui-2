export function parseEnv(key: string): string {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`Environment variable '${key}' is required`);
  }

  return value;
}

export function generateId() {
  return crypto.randomUUID();
}

/** Get keys of `T` where the property `T[K]` is a string. */
type StringPropertyKeys<T> = keyof T extends infer K
  ? K extends keyof T
    ? T[K] extends string
      ? K
      : never
    : never
  : never;

/**
 * Creates a filter predicate to filter an array of objects where the value of
 * property `key` must contain the substring `query`.
 * @param key key of property to check for substring
 * @param query substring to check for
 * @returns predicate function
 */
export function queryBy<T>(key: StringPropertyKeys<T>, query: string) {
  return (item: T) => {
    const value = item[key] as string;

    return value.toUpperCase().includes(query.toUpperCase());
  };
}

/**
 * Creates a compare function to sort an array of objects alphabetically on property `key`.
 * @param key key to compare alphabetically
 * @returns compare function
 */
export function sortAlphabeticallyBy<T>(key: StringPropertyKeys<T>) {
  return (a: T, b: T) => {
    if (a[key] > b[key]) {
      return 1;
    } else if (a[key] < b[key]) {
      return -1;
    }

    return 0;
  };
}

export * from "./colours";
