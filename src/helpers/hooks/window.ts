"use client";

import { useEffect, useState } from "react";

interface WindowSize {
    width?: number;
    height?: number;
    isMobile: boolean;
  }
  
export const useWindowSize = (): WindowSize => {
    if (typeof window === 'undefined') return {isMobile: false}
    // Initialize state with undefined width/height so server and client renders match
    const [windowSize, setWindowSize] = useState<WindowSize>({
      width: undefined,
      height: undefined,
      isMobile: false,
    });
  
    useEffect(() => {
      // Handler to call on window resize
      function handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
  
        // Define the breakpoint for mobile devices
        const isMobile = width <= 768; // You can adjust the breakpoint as needed
  
        // Update state
        setWindowSize({
          width,
          height,
          isMobile,
        });
      }

      if (typeof window !== 'undefined') {
        // Add event listener
        window.addEventListener('resize', handleResize);
  
        // Call handler right away so state gets updated with initial window size
        handleResize();
  
        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
      }
      }, [window]); // Empty array ensures that effect is only run on mount and unmount
  
    return windowSize;
  }
  
  export default useWindowSize;
  