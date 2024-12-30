import { useEffect, useMemo, useState } from "preact/hooks";

export function useMediaQuery(query: string) {
  const mediaQuery = useMemo(() => window.matchMedia(query), [query]);

  const [matches, setMatches] = useState(mediaQuery.matches);

  useEffect(() => {
    function onMatchMediaChange(event: MediaQueryListEvent) {
      setMatches(event.matches);
    }

    mediaQuery.addEventListener("change", onMatchMediaChange);

    return () => mediaQuery.removeEventListener("change", onMatchMediaChange);
  }, [mediaQuery]);

  return matches;
}
