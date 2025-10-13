import { useEffect, useRef, useState } from "react";

function joinClassNames(...classNames) {
  return classNames.filter(Boolean).join(" ");
}

export default function LazyIframe({
  containerClassName = "",
  containerStyle,
  placeholder = null,
  ...iframeProps
}) {
  const [isVisible, setIsVisible] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const element = wrapperRef.current;

    if (!element) {
      return undefined;
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "160px",
        threshold: 0.1,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={joinClassNames("lazy-iframe", containerClassName)}
      style={containerStyle}
    >
      {isVisible ? <iframe {...iframeProps} /> : placeholder}
    </div>
  );
}
