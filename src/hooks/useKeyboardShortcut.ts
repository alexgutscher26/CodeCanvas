import { useEffect } from 'react';

type KeyboardKey = string;
type Callback = () => void;
type Options = {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
};

export function useKeyboardShortcut(
  key: KeyboardKey,
  callback: Callback,
  options: Options = {}
) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const { ctrl = false, alt = false, shift = false, meta = false } = options;

      // Check if the pressed key matches and all modifier requirements are met
      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        !!event.ctrlKey === ctrl &&
        !!event.altKey === alt &&
        !!event.shiftKey === shift &&
        !!event.metaKey === meta &&
        // Don't trigger if user is typing in an input or textarea
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement)
      ) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, options]);
}
