/* eslint-disable */
/*
  Pre-renders the landing page into build/index.html after `react-scripts build`.

  Why: a plain Create React App page is empty HTML until the JavaScript bundle
  has downloaded and run, so the first paint waits on ~75 KB of JS. With the
  markup already in the HTML the hero paints as soon as the stylesheet does,
  and React then hydrates the page in place. The stylesheet is inlined too, so
  there is no render-blocking request at all.

  Runs on plain Node with the Babel preset CRA already ships; no browser needed.
*/
const fs = require("fs");
const path = require("path");

process.env.NODE_ENV = "production";
process.env.BABEL_ENV = "production";

const root = path.resolve(__dirname, "..");
const src = path.join(root, "src");
const buildDir = path.join(root, "build");
const indexPath = path.join(buildDir, "index.html");

/* --- compile src/*.js(x) on require, with the same preset the build used --- */
const babel = require("@babel/core");
const presetReactApp = require.resolve("babel-preset-react-app");

const compile = (module, filename) => {
  const code = fs.readFileSync(filename, "utf8");
  const out = babel.transformSync(code, {
    filename,
    babelrc: false,
    configFile: false,
    presets: [[presetReactApp, { runtime: "automatic" }]],
    sourceMaps: false,
  });
  module._compile(out.code, filename);
};

const originalJs = require.extensions[".js"];
require.extensions[".js"] = (module, filename) => {
  if (filename.startsWith(src)) return compile(module, filename);
  return originalJs(module, filename);
};
require.extensions[".jsx"] = compile;
require.extensions[".css"] = () => {};

/* --- render --- */
const React = require("react");
const { renderToString } = require("react-dom/server");
const App = require(path.join(src, "App.jsx")).default;
const { PortfolioProvider } = require(
  path.join(src, "context", "PortfolioContext.jsx"),
);

const html = renderToString(
  React.createElement(
    PortfolioProvider,
    null,
    React.createElement(App, { path: "/" }),
  ),
);

/* --- write --- */
let page = fs.readFileSync(indexPath, "utf8");

const rootTag = '<div id="root"></div>';
if (!page.includes(rootTag)) {
  console.error(
    "prerender: could not find the root element in build/index.html",
  );
  process.exit(1);
}
page = page.replace(rootTag, `<div id="root">${html}</div>`);

/* inline the stylesheet so nothing blocks the first paint */
page = page.replace(
  /<link href="([^"]+\.css)" rel="stylesheet">/,
  (match, href) => {
    const file = path.join(buildDir, href.replace(/^\//, ""));
    if (!fs.existsSync(file)) return match;
    const css = fs.readFileSync(file, "utf8");
    return `<style>${css}</style>`;
  },
);

/* Load the app bundle after the first frame has painted. The markup is
   already on the page, so nothing visible waits on JavaScript; the bundle
   only has to hydrate what is there. */
let mainSrc = null;
page = page.replace(
  /<script defer(?:="defer")? src="([^"]+main\.[^"]+\.js)"><\/script>/,
  (match, srcUrl) => {
    mainSrc = srcUrl;
    return "";
  },
);
if (mainSrc) {
  const loader =
    `<script>(function(){function l(){var s=document.createElement("script");s.src=${JSON.stringify(mainSrc)};s.async=true;document.head.appendChild(s)}` +
    `if("requestAnimationFrame"in window){requestAnimationFrame(function(){setTimeout(l,0)})}else{l()}})()</script>`;
  page = page.replace("</body>", `${loader}</body>`);
} else {
  console.warn(
    "prerender: main bundle script tag not found; leaving script loading as built",
  );
}

/* Any other URL (a case study, the admin) is served this same file by the
   SPA fallback, so the landing markup is hidden until React has rendered the
   right page, instead of flashing the home page first. */
page = page.replace(
  "</head>",
  `<style>html.not-home #root{visibility:hidden}</style>` +
    `<script>if(location.pathname.replace(/\\/+$/,"")!==""){document.documentElement.classList.add("not-home")}</script></head>`,
);

fs.writeFileSync(indexPath, page);
console.log(
  `prerender: wrote ${(html.length / 1024).toFixed(1)} KB of markup into build/index.html`,
);
