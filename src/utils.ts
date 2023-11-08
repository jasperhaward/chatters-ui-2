export function caseInsensitiveIncludes(string: string, search: string) {
  return string.toUpperCase().includes(search.toUpperCase());
}
