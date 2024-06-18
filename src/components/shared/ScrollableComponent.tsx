import React, { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./ScrollableComponent.module.css";

const ScrollableContent = ({ children }: { children: ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shadowLeft, setShadowLeft] = useState(false);
  const [shadowRight, setShadowRight] = useState(false);

  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setShadowLeft(scrollLeft > 0);
    setShadowRight(scrollLeft < scrollWidth - clientWidth);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    handleScroll(); // Initial check
    containerRef.current.addEventListener("scroll", handleScroll);

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.shadow} ${shadowLeft ? styles.visible : ""} ${
          styles.left
        }`}
      />
      <div
        className={`${styles.shadow} ${shadowRight ? styles.visible : ""} ${
          styles.right
        }`}
      />
      <div className={styles.container} ref={containerRef}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default ScrollableContent;
