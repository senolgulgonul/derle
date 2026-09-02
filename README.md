# Derle — a real C compiler in your browser

**Live:** https://senolgulgonul.github.io/derle/

Derle compiles and runs standard C entirely inside your browser tab.
No installation, no account, no server: clang 18 and the wasm linker
themselves run as WebAssembly, the compiled program runs natively in
the browser, and nothing you type ever leaves your machine.

Write C on the left, press **Compile**, then **Run**. Program input
goes in the **Input (stdin)** box; output and compiler diagnostics
appear in the **Console**. The first visit downloads the toolchain
once (~23 MB compressed); after that everything is served from cache
and each compile takes a few seconds.

## Loading code from a URL

Append `?src=` with a raw file URL to open code directly in the editor:

```
https://senolgulgonul.github.io/derle/?src=https://raw.githubusercontent.com/senolgulgonul/derle/main/examples/derle-test.c
```

The `examples/` folder contains small programs exercising stdout,
stdin, stderr/exit codes, compiler diagnostics and the 10-second
infinite-loop guard.

## How it works

- **clang 18.1.2 + lld (wasm-ld)**, built from source with Emscripten
  into `toolchain/clang.wasm` and `toolchain/lld.wasm`
- **wasi-libc sysroot** (wasi-sdk 24, C-only) unpacked into an
  in-memory filesystem inside a Web Worker
- pipeline: editor source → clang `-c` (in-process cc1, `-std=c99 -Wall`
  planned as course default) → wasm-ld → `main.wasm`
- the produced program targets **wasm32-wasi** and runs under a small
  (~100 line) WASI shim: `fd_write` → console, `fd_read` → the Input
  box, `proc_exit` → exit code; runaway programs are halted after 10 s

Derle is a sibling of [Sekiz](https://senolgulgonul.github.io/sekiz/)
(Arduino toolchain + cycle-accurate ATmega328P simulator in the
browser) and [VeriSim](https://senolgulgonul.github.io/verisim/)
(Icarus Verilog + Yosys in the browser), and will anchor an upcoming
structured C programming course for first-year EEE students.

## License note

The shipped toolchain contains LLVM/clang (Apache-2.0 WITH
LLVM-exception) and wasi-libc (Apache-2.0/MIT) binaries built from
unmodified upstream sources at tag `llvmorg-18.1.2` / wasi-sdk 24.

---

Derle is built and maintained by **Şenol Gülgönül**
(Asst. Prof., Electrical & Electronics Engineering).
