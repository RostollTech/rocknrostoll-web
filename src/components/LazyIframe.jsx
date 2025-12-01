import { useEffect, useRef, useState, forwardRef } from "react";

function joinClassNames(...classNames) {
  return classNames.filter(Boolean).join(" ");
}

const LazyIframe = forwardRef(function LazyIframe(
  {
    containerClassName = "",
    containerStyle,
    placeholder = null,
    title = "Contingut incrustat",
    ...iframeProps
  },
  ref,
) {
  const [isVisible, setIsVisible] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const element = wrapperRef.current;

    if (!element) {
      return undefined;
    }

    // Si no hi ha IntersectionObserver (navegadors antics) o estem al servidor, mostram directament
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
        rootMargin: "200px", // Carregam una mica abans d'arribar
        threshold: 0.01,
      },
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
      {isVisible ? (
        <iframe
          ref={ref}
          title={title}
          {...iframeProps}
        />
      ) : (
        placeholder
      )}
    </div>
  );
});

export default LazyIframe;
