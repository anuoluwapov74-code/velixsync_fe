"use client";

import { useState, useEffect } from "react";
import Preloader from "./Preloader";

interface PagePreloaderProps {
  children: React.ReactNode;
  delay?: number;
}

export default function PagePreloader({ children, delay = 800 }: PagePreloaderProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (isLoading) {
    return <Preloader />;
  }

  return <>{children}</>;
}
