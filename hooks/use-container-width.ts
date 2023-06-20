"use client";
import { useRef, useEffect, useState } from "react";

export const useContainerWidth = (): [
  React.Ref<HTMLDivElement>,
  number | null
] => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  const handleResize = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  };
  useEffect(() => {
    handleResize();
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(containerRef.current);

      const curr = containerRef.current;

      return () => {
        if (curr) {
          resizeObserver.unobserve(curr);
        }
      };
    }
  }, []);
  return [containerRef, containerWidth];
};
