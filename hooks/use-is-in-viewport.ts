"use client";
import { useState, useEffect, useRef } from "react";

type UseIsInViewportOptions = {
  threshold?: number;
};

export const useIsInViewport = (
  options: UseIsInViewportOptions = {}
): [boolean, React.RefObject<HTMLDivElement>] => {
  const { threshold = 0 } = options;
  const [isInViewport, setIsInViewport] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsInViewport(entry.isIntersecting);
        }
      },
      {
        threshold: threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold]);

  return [isInViewport, ref];
};
