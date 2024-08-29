import React, { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./ScrollableComponent.module.css";

interface ScrollableContentProps {
  children: ReactNode;
  classNames?: {
    wrapper?: string;
    container?: string;
    content?: string;
  };
  styles?: {
    wrapper?: React.CSSProperties;
    container?: React.CSSProperties;
    content?: React.CSSProperties;
  };
}

const ScrollableContent = ({
  children,
  classNames,
  styles: _styles,
}: ScrollableContentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shadowLeft, setShadowLeft] = useState(false);
  const [shadowRight, setShadowRight] = useState(false);

  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    console.log("scrollLeft", scrollLeft, scrollWidth, clientWidth);
    setShadowLeft(scrollLeft > 0);
    setShadowRight(scrollLeft < scrollWidth - clientWidth);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    setTimeout(() => {
      handleScroll(); // Initial check
    }, 500);
    containerRef.current.addEventListener("scroll", handleScroll);

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div
      className={styles.wrapper + " " + (classNames?.wrapper ?? "")}
      style={_styles?.wrapper}
    >
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

export const ScrollableVerticalContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shadowTop, setShadowTop] = useState(false);
  const [shadowBottom, setShadowBottom] = useState(false);

  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setShadowTop(scrollTop > 0);
    setShadowBottom(scrollTop < scrollHeight - clientHeight);
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
    <div className={styles.vertical_wrapper + " " + className}>
      <div
        className={`${styles.shadow} ${shadowTop ? styles.visible : ""} ${
          styles.top
        }`}
      />
      <div
        className={`${styles.shadow} ${shadowBottom ? styles.visible : ""} ${
          styles.bottom
        }`}
      />
      <div
        className={styles.vertical_container + " " + className}
        ref={containerRef}
      >
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default ScrollableContent;
