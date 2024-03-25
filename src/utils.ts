export function caseInsensitiveIncludes(string: string, substring: string) {
  return string.toUpperCase().includes(substring.toUpperCase());
}
