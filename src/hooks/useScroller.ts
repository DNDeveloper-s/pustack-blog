import { useEffect, useRef, useState } from "react";

export default function useScroller() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrollTop, setHasScrollTop] = useState(false);
  const [hasScrollBottom, setHasScrollBottom] = useState(false);

  useEffect(() => {
    if (!scrollRef.current) return;
    const scrollEl = scrollRef.current;

    function handleScroll() {
      if (!scrollEl) return;
      // Check if the container has scroll offset on top
      setHasScrollTop(scrollEl.scrollTop > 0);
      // Check if the container has scroll offset on bottom
      setHasScrollBottom(
        scrollEl.scrollTop + scrollEl.clientHeight < scrollEl.scrollHeight
      );
    }

    handleScroll();
    scrollEl.addEventListener("scroll", handleScroll);

    return () => {
      if (scrollEl) {
        scrollEl.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return { scrollRef, hasScrollTop, hasScrollBottom };
}
