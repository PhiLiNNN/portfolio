// Apply theme and accent hue before first paint to avoid a flash (FOUC).
// External file (not inline) so it passes the strict CSP (no 'unsafe-inline').
(function () {
  try {
    var root = document.documentElement;
    var stored = localStorage.getItem("theme");
    var prefersLight =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches;
    // Dark is the default look; the OS light preference or an explicit choice
    // switches to light.
    var theme = stored === "light" || stored === "dark" ? stored : prefersLight ? "light" : "dark";
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.setAttribute("content", theme);

    var hue = localStorage.getItem("accent-hue");
    if (hue !== null && hue !== "" && !isNaN(Number(hue))) {
      root.setAttribute("data-hue", "");
      root.style.setProperty("--hue", String(Number(hue)));
    }
  } catch (e) {}
})();
