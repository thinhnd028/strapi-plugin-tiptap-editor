/**
 * Safely resets pointer events on the body element after a delay.
 * Useful for handling transition end cases where pointer-events might get stuck.
 * 
 * @param delay - Delay in milliseconds before resetting (default: 100).
 */
export function safelyResetPointerEvents(delay = 100) {
  // Execute after transition ends (use rAF + timeout for stability)
  requestAnimationFrame(() => {
    setTimeout(() => {
      if (document?.body?.style?.pointerEvents === 'none') {
        document.body.style.pointerEvents = '';
      }
    }, delay);
  });
}