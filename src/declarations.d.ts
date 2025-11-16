// Temporary module declarations for libraries without types
declare module 'react-native-vector-icons/*' {
  const content: any;
  export default content;
}

declare module 'react-native-vector-icons/MaterialIcons' {
  const MaterialIcons: any;
  export default MaterialIcons;
}

// If other modules produce errors add them here as `declare module '...';`

// Wildcard fallbacks for internal TS modules referenced by .js-less imports during NodeNext migration
declare module '*globalStyles' {
  export const globalStyles: any;
}

declare module '*theme' {
  export const theme: any;
  const _default: any;
  export default _default;
}

// Explicit NodeNext-style extensions for local theme files (source imports use .js when targeting NodeNext)
declare module '*/theme/globalStyles.js' {
  export const globalStyles: any;
  const _default: any;
  export default _default;
}

declare module '*/theme/theme.js' {
  export const theme: any;
  const _default: any;
  export default _default;
}

// react-native-pager-view has TypeScript defs that can be strict; provide a loose fallback
declare module 'react-native-pager-view' {
  const PagerView: any;
  export default PagerView;
}

// Sometimes the package is imported as a .js subpath under NodeNext resolution
declare module 'react-native-vector-icons/MaterialIcons.js' {
  const MaterialIcons: any;
  export default MaterialIcons;
}

// Provide minimal JSX namespace so TS recognizes JSX in files while migrating
import type React from 'react';
declare global {
  namespace JSX {
    // make Element compatible with React's elements
    type Element = React.ReactElement<any, any>;
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
