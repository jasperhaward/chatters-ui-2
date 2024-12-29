import { Ref } from "preact";
import { useEffect, useRef } from "preact/hooks";

export interface UseScrollIntoViewOptions {
  enabled: boolean;
}

const defaultOptions: UseScrollIntoViewOptions = {
  enabled: true,
};

export function useScrollIntoView<T extends HTMLElement>(
  dependencies: unknown[],
  options: UseScrollIntoViewOptions = defaultOptions
): Ref<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current && options.enabled && !isElementFullyVisible(ref.current)) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [...dependencies, options.enabled]);

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
