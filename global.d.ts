// Minimal global JSX declarations to ensure the `JSX` namespace is available
// This is a fallback for environments where @types/react or other JSX
// typings are not yet resolved. It can be tightened later.
declare namespace JSX {
  // Make any intrinsic element allowed
  interface IntrinsicElements {
    [elemName: string]: any;
  }

  // Basic Element type
  type Element = any;
}
