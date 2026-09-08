import "@testing-library/jest-dom/vitest";

// jsdom implements neither — components using motion's viewport features
// (TextReveal) or useReducedMotion need these to render at all in tests.
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-expect-error jsdom has no IntersectionObserver
window.IntersectionObserver = MockIntersectionObserver;

if (typeof window.matchMedia !== "function") {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
