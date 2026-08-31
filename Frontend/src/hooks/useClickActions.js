import { useRef } from "react";

export function useClickActions({ onSingle, onDouble, delay = 220 }) {
  const timerRef = useRef(null);

  const handleClick = (event, ...args) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      onDouble?.(...args);
      return;
    }
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      onSingle?.(...args);
    }, delay);
  };

  const cancelClick = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return { handleClick, cancelClick };
}
