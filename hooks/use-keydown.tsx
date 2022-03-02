import { useEffect } from "react";

function useKeydown(callback: () => void, code: string): void {
  useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
      if (code.includes(event.code)) callback();
    };
    window.addEventListener("keydown", keydownHandler);
    return () => window.removeEventListener("keydown", keydownHandler);
  }, [callback, code]);
}

export default useKeydown;
