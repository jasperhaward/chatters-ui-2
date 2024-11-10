import { Ref } from "preact";
import { useEffect, useRef } from "preact/hooks";

export function useScrollIntoView<T extends HTMLElement>(
  enabled: boolean
): Ref<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current && enabled && !isElementFullyVisible(ref.current)) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [enabled]);

  return ref;
}

function isElementFullyVisible<T extends HTMLElement>(element: T) {
  const container = element.parentElement!;

  const containerTop = container.offsetTop + container.scrollTop;
  const containerBottom = containerTop + container.clientHeight;

  const elementTop = element.offsetTop;
  const elementBottom = elementTop + element.clientHeight;

  return elementTop >= containerTop && elementBottom <= containerBottom;
}
