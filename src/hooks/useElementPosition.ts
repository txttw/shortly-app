import { useLayoutEffect, useState } from "react";

export const useElementPosition = (selector: string) => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [boundingBox, setBoundingBox] = useState<DOMRect | undefined>();

  useLayoutEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      const lc = document.querySelector(selector);
      const bb = lc?.getBoundingClientRect();
      if (bb) {
        setBoundingBox(bb);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [selector]);

  return { boundingBox, windowDimensions };
};
