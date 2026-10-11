/* eslint-disable */
/*
  Writes the content in src/context/PortfolioContext.jsx (projects, roles,
  services, social links) into the live database, so chiragchhabra.vercel.app
  shows the same text as the code.

  Why: the site loads its projects and experience from MongoDB when it can,
  and whatever is saved there wins over the defaults in the code. After the
  defaults are rewritten, the database still holds the old text until it is
  updated — through the admin dashboard, one field at a time, or with this.

    node scripts/sync-content.js           show what would change, write nothing
    node scripts/sync-content.js --write   write it

  Reads MONGODB_URI from the environment or from .env / .env.local in the
  project root. Never prints the connection string or any password.

  Rules: the curated projects (matched by title) and roles (matched by
  company) take the code's text; projects or roles that exist only in the
  database are kept, after them. Social links from the code win where the
  code has one, otherwise the saved link stays. Everything else in the
  document — the admin password, 2FA secret, visitor count, maintenance mode,
  notification settings — is untouched.
*/
const fs = require("fs");
const path = require("path");

process.env.NODE_ENV = process.env.NODE_ENV || "production";
process.env.BABEL_ENV = process.env.BABEL_ENV || "production";

const root = path.resolve(__dirname, "..");
const src = path.join(root, "src");

/* --- .env: only the keys that are not already set, never echoed --- */
const loadEnv = () => {
  for (const name of [".env", ".env.local"]) {
    const file = path.join(root, name);
    if (!fs.existsSync(file)) continue;
    for (const raw of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq < 1) continue;
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      )
        value = value.slice(1, -1);
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
};

/* --- compile src/*.js(x) on require, with the preset CRA ships --- */
const loadDefaults = () => {
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
  const { DEFAULT_CONTENT } = require(
    path.join(src, "context", "PortfolioContext.jsx"),
  );
  return DEFAULT_CONTENT;
};

/* --- the merge, as pure functions so they can be checked without a database --- */
const norm = (s) => String(s || "").trim().toLowerCase();

const mergeByKey = (defaults, saved, key) => {
  const extras = Array.isArray(saved)
    ? saved.filter((s) => !defaults.some((d) => norm(d[key]) === norm(s[key])))
    : [];
  /* an extra whose id clashes with a curated one gets a fresh id, so the
     admin dashboard edits the right item */
  const taken = new Set(defaults.map((d) => String(d.id)));
  const numeric = defaults.every((d) => typeof d.id === "number");
  let n = defaults.length;
  return [
    ...defaults,
    ...extras.map((x) => {
      if (!taken.has(String(x.id))) return x;
      n += 1;
      while (taken.has(String(n))) n += 1;
      const id = numeric ? n : String(n).padStart(2, "0");
      taken.add(String(id));
      return { ...x, id };
    }),
  ];
};

const mergeLinks = (defaults, saved) => {
  const out = { ...(saved || {}) };
  for (const [k, v] of Object.entries(defaults)) if (v) out[k] = v;
  return out;
};

const plan = (defaults, current) => {
  const next = {
    projects: mergeByKey(defaults.projects, current.projects, "title"),
    experience: mergeByKey(defaults.experience, current.experience, "company"),
    services: defaults.services,
    socialLinks: mergeLinks(defaults.socialLinks, current.socialLinks),
  };
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const changes = {};
  for (const [k, v] of Object.entries(next))
    if (!same(v, current[k])) changes[k] = v;
  return { next, changes };
};

/* --- a readable summary of what differs, per item --- */
const describe = (defaults, current, next) => {
  const lines = [];
  const list = (label, before, after, key) => {
    const beforeBy = new Map((before || []).map((x) => [norm(x[key]), x]));
    for (const item of after) {
      const old = beforeBy.get(norm(item[key]));
      if (!old) lines.push(`  + ${label}: ${item[key]} (new)`);
      else if (JSON.stringify(old) !== JSON.stringify(item)) {
        const fields = Object.keys(item).filter(
          (f) => JSON.stringify(old[f]) !== JSON.stringify(item[f]),
        );
        lines.push(`  ~ ${label}: ${item[key]} (${fields.join(", ")})`);
      }
    }
    for (const old of before || [])
      if (!after.some((x) => norm(x[key]) === norm(old[key])))
        lines.push(`  - ${label}: ${old[key]} (would be removed)`);
  };
  list("project", current.projects, next.projects, "title");
  list("role", current.experience, next.experience, "company");
  if (JSON.stringify(current.services) !== JSON.stringify(next.services))
    lines.push("  ~ services: replaced with the code's three");
  for (const [k, v] of Object.entries(next.socialLinks))
    if ((current.socialLinks || {})[k] !== v) lines.push(`  ~ social: ${k}`);
  return lines;
};

const main = async () => {
  const write = process.argv.includes("--write");
  loadEnv();
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error(
      "sync-content: MONGODB_URI is not set. Put it in .env (same value as on Vercel) or set it in the shell.",
    );
    process.exit(1);
  }
  const defaults = loadDefaults();
  const { MongoClient } = require("mongodb");
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const collection = client.db("portfolio_db").collection("content");
    const current = (await collection.findOne({ _id: "main_content" })) || {};
    const { next, changes } = plan(defaults, current);
    const lines = describe(defaults, current, next);
    if (!Object.keys(changes).length) {
      console.log("sync-content: the database already matches the code. Nothing to do.");
      return;
    }
    console.log(
      `sync-content: ${Object.keys(changes).join(", ")} differ from the code:`,
    );
    for (const l of lines) console.log(l);
    if (!write) {
      console.log(
        "\nDry run — nothing written. Run again with --write to update the live site.",
      );
      return;
    }
    await collection.updateOne(
      { _id: "main_content" },
      { $set: { ...changes, updatedAt: new Date() } },
      { upsert: true },
    );
    console.log(
      `\nWritten. The live site shows the new ${Object.keys(changes).join(", ")} on its next load.`,
    );
  } finally {
    await client.close();
  }
};

if (require.main === module) {
  main().catch((err) => {
    console.error(`sync-content: ${err.message}`);
    process.exit(1);
  });
}

module.exports = { plan, describe, mergeByKey, mergeLinks, loadDefaults };
