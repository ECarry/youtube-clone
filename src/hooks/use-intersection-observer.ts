import { useEffect, useRef, useState } from "react";

export const useIntersectionObserver = (options?: IntersectionObserverInit) => {
  const [isIntersecting, setIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      options
    );

    if (!targetRef.current) return;
    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [options]);

  return { isIntersecting, targetRef };
};
