const CONSOLE_BRIDGE = `
<script>
(function () {
  function send(level, args) {
    try {
      var msg = args.map(function (a) {
        if (a instanceof Error) return a.message;
        try { return typeof a === 'string' ? a : JSON.stringify(a); } catch (e) { return String(a); }
      }).join(' ');
      parent.postMessage({ source: 'coding-spy-lab', level: level, message: msg }, '*');
    } catch (e) {}
  }
  ['log', 'info', 'warn', 'error'].forEach(function (level) {
    var orig = console[level];
    console[level] = function () {
      send(level, Array.prototype.slice.call(arguments));
      orig && orig.apply(console, arguments);
    };
  });
  window.addEventListener('error', function (e) {
    send('error', [e.message + ' (line ' + e.lineno + ')']);
  });
})();
<\/script>
`;

export function buildHtmlDocument(params: { html: string; css: string; js: string; mode: "html" | "css" | "js" }) {
  if (params.mode === "js") {
    return `<!doctype html><html><head>${CONSOLE_BRIDGE}</head><body><div id="app"></div><script>${params.js}<\/script></body></html>`;
  }
  return `<!doctype html><html><head>${CONSOLE_BRIDGE}<style>${params.css}</style></head><body>${params.html}<script>${params.js}<\/script></body></html>`;
}
