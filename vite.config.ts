// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@home": path.resolve(__dirname, "src/modules/home"),
    },
  },

  // Pre‐bundle these for dev so you don’t hit CJS‐in‐ESM errors
  optimizeDeps: {
    include: [
      "axios",
      "follow-redirects",
      "react-intl",
      "tslib",
      "cssstyle",
      "@asamuzakjp/css-color",
      "redent",
      "@adobe/css-tools",
      // ...any others you need at runtime
    ],
    esbuildOptions: {
      target: "esnext",
      format: "esm",
    },
  },

  test: {
    globals: true,
    setupFiles: ['./tests/setupTests.ts'],
    environment: "happy-dom",  // or "jsdom"
    // run *.test.tsx in both src/ and tests/
    include: [
      "src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    deps: {
      // inline the same list (so Vitest bundles the CJS modules instead of ESM‐importing them)
      inline: [
        "axios",
        "follow-redirects",
        "react-intl",
        "tslib",
        "cssstyle",
        "@asamuzakjp/css-color",
        "redent",
        "@adobe/css-tools",
        // plus your test utils
        "@testing-library/dom",
        "@testing-library/react",
        "dom-accessibility-api",
      ],
    },
  },
});



// // npm run test
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'

// export default defineConfig({
//   plugins: [react()],

//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, 'src'),
//       '@home': path.resolve(__dirname, 'src/modules/home'),
//     },
//   },

//   // Vite will pre‐bundle these deps so you don’t hit CJS-in-ESM issues
//   optimizeDeps: {
//     include: [
//       'axios',
//       'follow-redirects',
//       'react-intl',
//       // ...other heavy libs you really need to pre-bundle
//     ],
//   },

//   test: {
//     globals: true,
//     environment: 'jsdom',

//     // Tell Vitest to inline the same deps (so it doesn't try ESM-import the CJS bits)
//     deps: {
//       inline: ['axios', 'follow-redirects'],
//     },

//     include: [
//       'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
//       'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
//     ],
//   },
// })


// // //=========================================================
// // // import { defineConfig } from 'vite'
// // //import { defineConfig } from 'vitest/config'
// // npm run dev

// import { defineConfig } from 'vite'   
// import react from '@vitejs/plugin-react'
// import path from 'path';


// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, 'src'),
//       '@home': path.resolve(__dirname, 'src/modules/home'),
//     },
//     // Asegura que Vite reconozca las condiciones de importación de ESM
//     conditions: ['import', 'require'],
//   },
//   // Pre-bundle estas dependencias para que no se queden apuntando al .mjs
//   optimizeDeps: {
//     include: [
//       'react-intl',
//       'tslib',
//       'cssstyle',
//       '@asamuzakjp/css-color',
//       'redent',
//       '@adobe/css-tools',
//       // <-- añado esta línea:
//       'dom-accessibility-api',
//       '@testing-library/dom',
//       '@testing-library/react',
//     ],
//     esbuildOptions: {
//       target: 'esnext',
//       format: 'esm',
//     },
//   },

//   test: {
//     globals: true,
//     environment: 'happy-dom',
//     include: [
//       'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
//       'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
//     ],

//     // Fuerza a Vitest a inlinear estos módulos ESM en lugar de importarlos
//     deps: {
//       inline: [
//         'react-intl',
//         'tslib',
//         'cssstyle',
//         '@asamuzakjp/css-color',
//         'redent',
//         '@adobe/css-tools',
//         // <-- y aquí también:
//         'dom-accessibility-api',
//         '@testing-library/dom',
//         '@testing-library/react',
//       ],
//     },   
        
//   }, 
// })
