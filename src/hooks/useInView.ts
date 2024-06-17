import React, { useCallback, useEffect, useRef } from "react";

export interface UseInViewOptions {
  /**
   * The time in milliseconds the element has to be in view to trigger the callback.
   * Default is 0.
   * */
  timeInView?: number;
}

export default function useInView(options?: UseInViewOptions) {
  const [isInView, setIsInView] = React.useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const ref = useCallback(
    (node: any) => {
      if (node) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              if (options?.timeInView) {
                timerRef.current = setTimeout(() => {
                  setIsInView(true);
                }, options.timeInView);
              } else {
                setIsInView(true);
              }
            } else {
              if (timerRef.current) {
                clearTimeout(timerRef.current);
              }
              setIsInView(false);
            }
          },
          {
            rootMargin: "0px",
            threshold: 0.1,
          }
        );
        observer.observe(node);
      }
    },
    [options?.timeInView]
  );

  // useEffect(() => {
  //   const refEl = ref.current;
  //   if (!refEl) return;
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting) {
  //         if (options?.timeInView) {
  //           timerRef.current = setTimeout(() => {
  //             setIsInView(true);
  //           }, options.timeInView);
  //         } else {
  //           setIsInView(true);
  //         }
  //       } else {
  //         if (timerRef.current) {
  //           clearTimeout(timerRef.current);
  //         }
  //         setIsInView(false);
  //       }
  //     },
  //     {
  //       rootMargin: "0px",
  //       threshold: 0.1,
  //     }
  //   );

  //   if (ref.current) {
  //     observer.observe(ref.current);
  //   }

  //   return () => {
  //     if (refEl) {
  //       observer.unobserve(refEl);
  //     }
  //   };
  // }, [options?.timeInView, ref]);

  return { ref, isInView };
}
