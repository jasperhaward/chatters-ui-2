import { Ref } from "preact";
import { useEffect, useRef } from "preact/hooks";

export function useScrollIntoView<T extends HTMLElement>(
  enabled: boolean
): Ref<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    if (enabled && !isFullyVisible(ref.current)) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [enabled]);

  function isFullyVisible(element: T) {
    const container = element.parentElement!;

    const containerTop = container.offsetTop + container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;

    const elementTop = element.offsetTop;
    const elementBottom = elementTop + element.clientHeight;

    return elementTop >= containerTop && elementBottom <= containerBottom;
  }

  return ref;
}
