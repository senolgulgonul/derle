# csim-app

The CSim page with the in-browser compiler wired in.

## Setup

Copy the five files from csim-toolchain's `dist/` into `toolchain/`:

```
csim-app/
├── index.html
├── js/
│   ├── compile.mjs           (shared with csim-toolchain, keep in sync)
│   └── compiler-worker.mjs
└── toolchain/
    ├── clang.mjs
    ├── clang.wasm
    ├── lld.mjs
    ├── lld.wasm
    └── sysroot.tar
```

## Local test

Module workers don't run from file:// — serve the folder:

```
cd csim-app
python3 -m http.server 8000
```

then open http://localhost:8000. Flow: type C code → Compile
(first click downloads the toolchain once, then it's cached) → Run.
The "Load .wasm" button remains as a developer path and still works
without the toolchain files.

## Deploy

Push the folder to a GitHub Pages branch as-is. If dist artifacts are
too big for the repo, host them on a GitHub Release and change the
`base` URL passed to the compiler worker in index.html.
Next step after first deploy: a Service Worker so the toolchain is
cached explicitly and the page works offline.
