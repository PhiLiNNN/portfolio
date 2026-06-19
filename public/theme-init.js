// Set the theme before first paint to avoid a light/dark flash (FOUC).
// Kept as an external file (not inline) so it passes a strict CSP that does
// not allow 'unsafe-inline' for script-src.
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = stored || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
