"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Fixed bar that appears below the header when a target element
 * scrolls out of view. Uses IntersectionObserver for performance.
 */
export default function StickyBar({
  children,
  observeId,
}: {
  children: ReactNode;
  observeId: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(observeId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-45px 0px 0px 0px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [observeId]);

  return (
    <div
      className={`fixed left-0 right-0 top-[45px] z-40 transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      {children}
    </div>
  );
}
