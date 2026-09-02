// csim-app/js/compiler-worker.mjs
// Runs clang + wasm-ld off the main thread. Loaded as a module worker.
// Protocol:
//   -> { type:'init', base }              base = absolute URL of toolchain/
//   <- { type:'ready' } | { type:'fatal', message }
//   -> { type:'compile', source, fileName }
//   <- { type:'result', ok, log, wasm }   wasm: Uint8Array on success
import { createCompiler } from './compile.mjs';

let compiler = null;

onmessage = async (ev) => {
  const msg = ev.data;
  try {
    if (msg.type === 'init') {
      const base = msg.base;
      const [clangFactory, lldFactory, sysrootTar] = await Promise.all([
        import(/* @vite-ignore */ base + 'clang.mjs').then(m => m.default),
        import(/* @vite-ignore */ base + 'lld.mjs').then(m => m.default),
        fetch(base + 'sysroot.tar').then(r => {
          if (!r.ok) throw new Error(`sysroot.tar: HTTP ${r.status}`);
          return r.arrayBuffer();
        }),
      ]);
      compiler = createCompiler({ clangFactory, lldFactory, sysrootTar });
      postMessage({ type: 'ready' });
    } else if (msg.type === 'compile') {
      if (!compiler) throw new Error('compiler not initialized');
      const r = await compiler.compile(msg.source, { fileName: msg.fileName || 'main.c' });
      postMessage(
        { type: 'result', ok: r.ok, log: r.log, wasm: r.wasm },
        r.wasm ? [r.wasm.buffer] : []
      );
    }
  } catch (e) {
    postMessage({ type: 'fatal', message: String((e && e.message) || e) });
  }
};
