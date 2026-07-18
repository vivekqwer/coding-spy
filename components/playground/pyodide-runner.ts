declare global {
  interface Window {
    loadPyodide?: (config?: { indexURL?: string }) => Promise<PyodideInterface>;
  }
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched: (msg: string) => void }) => void;
  setStderr: (opts: { batched: (msg: string) => void }) => void;
}

let pyodidePromise: Promise<PyodideInterface> | null = null;

const PYODIDE_VERSION = "0.26.2";
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Pyodide runtime."));
    document.head.appendChild(script);
  });
}

export async function getPyodide(): Promise<PyodideInterface> {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      await loadScript(`${PYODIDE_CDN}pyodide.js`);
      if (!window.loadPyodide) throw new Error("Pyodide failed to attach to window.");
      return window.loadPyodide({ indexURL: PYODIDE_CDN });
    })();
  }
  return pyodidePromise;
}

export async function runPython(
  code: string,
  onOutput: (msg: string, level: "log" | "error") => void
): Promise<void> {
  const pyodide = await getPyodide();
  pyodide.setStdout({ batched: (msg) => onOutput(msg, "log") });
  pyodide.setStderr({ batched: (msg) => onOutput(msg, "error") });
  try {
    await pyodide.runPythonAsync(code);
  } catch (err) {
    onOutput(err instanceof Error ? err.message : String(err), "error");
    throw err;
  }
}
