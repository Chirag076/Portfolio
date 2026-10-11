/* eslint-disable */
/*
  Writes the content in src/context/PortfolioContext.jsx (projects, roles,
  services, social links) into the live database, so chiragchhabra.vercel.app
  shows the same text as the code.

  Why: the site loads its projects and experience from MongoDB when it can,
  and whatever is saved there wins over the defaults in the code. After the
  defaults are rewritten, the database still holds the old text until it is
  updated — through the admin dashboard, one field at a time, or with this.

    node scripts/sync-content.js                      show what would change, write nothing
    node scripts/sync-content.js --write --code 123456   write it through the live site's
                                                      admin API, with a fresh 2FA code
    node scripts/sync-content.js --write              write it straight into MongoDB
                                                      (needs MONGODB_URI)

  Through the API (the default when --code is given, or when MONGODB_URI is
  not set) it talks to https://chiragchhabra.vercel.app/api/content, exactly
  like the dashboard's Save button: a valid 2FA code authorises the write,
  or ADMIN_PASSWORD from .env when two-factor is off. Set SITE_URL to point
  it somewhere else. Reads .env / .env.local in the project root. Never
  prints the connection string, the password or the code.

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

/* --- command line --- */
const arg = (name) => {
  const i = process.argv.findIndex((a) => a === name || a.startsWith(`${name}=`));
  if (i < 0) return undefined;
  const a = process.argv[i];
  return a.includes("=") ? a.slice(a.indexOf("=") + 1) : process.argv[i + 1];
};

/* the two ways to reach the document: straight into MongoDB, or through the
   site's own admin API. Both return { read(), write(changes) }. */
const viaDatabase = (uri) => {
  const { MongoClient } = require("mongodb");
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
  const collection = () => client.db("portfolio_db").collection("content");
  return {
    label: "the database",
    read: async () => {
      await client.connect();
      return (await collection().findOne({ _id: "main_content" })) || {};
    },
    write: async (changes) => {
      await collection().updateOne(
        { _id: "main_content" },
        { $set: { ...changes, updatedAt: new Date() } },
        { upsert: true },
      );
    },
    close: () => client.close(),
  };
};

const viaApi = (site, code, password) => {
  const url = `${site.replace(/\/+$/, "")}/api/content`;
  const check = async (res) => {
    let data = {};
    try {
      data = await res.json();
    } catch (e) {
      /* a non-JSON error page */
    }
    if (!res.ok || data.error) {
      const why = String(
        data.details || data.error || `${res.status} ${res.statusText}`,
      ).replace(/\.$/, "");
      if (res.status === 401)
        throw new Error(
          `the site refused the write: ${why}. Codes last 30 seconds — run again with a fresh one.`,
        );
      throw new Error(`${url} answered ${why}`);
    }
    return data;
  };
  return {
    label: site,
    read: async () => check(await fetch(url)),
    write: async (changes) => {
      await check(
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            twoFactorCode: code || undefined,
            password: password || undefined,
            content: changes,
          }),
        }),
      );
    },
    close: async () => {},
  };
};

const main = async () => {
  const write = process.argv.includes("--write");
  const code = arg("--code");
  loadEnv();
  const site = process.env.SITE_URL || "https://chiragchhabra.vercel.app";
  const useApi = !!code || process.argv.includes("--api") || !process.env.MONGODB_URI;
  if (code && !/^\d{6}$/.test(code)) {
    console.error("sync-content: --code wants the 6 digits from your authenticator app.");
    process.exit(1);
  }
  const defaults = loadDefaults();
  const store = useApi
    ? viaApi(site, code, process.env.ADMIN_PASSWORD)
    : viaDatabase(process.env.MONGODB_URI);
  try {
    const current = await store.read();
    const { next, changes } = plan(defaults, current);
    const lines = describe(defaults, current, next);
    if (!Object.keys(changes).length) {
      console.log(`sync-content: ${store.label} already matches the code. Nothing to do.`);
      return;
    }
    console.log(
      `sync-content: ${Object.keys(changes).join(", ")} on ${store.label} differ from the code:`,
    );
    for (const l of lines) console.log(l);
    if (!write) {
      console.log(
        `\nDry run — nothing written. Run again with --write${
          useApi && current.has2FA ? " --code <6 digits from your authenticator>" : ""
        } to update the live site.`,
      );
      return;
    }
    if (useApi && current.has2FA && !code) {
      console.error(
        "\nTwo-factor is on for the dashboard, so the write needs --code <6 digits from your authenticator>.",
      );
      process.exit(1);
    }
    if (useApi && !current.has2FA && !code && !process.env.ADMIN_PASSWORD) {
      console.error(
        "\nThe write needs the admin password: put ADMIN_PASSWORD in .env (never on the command line).",
      );
      process.exit(1);
    }
    await store.write(changes);
    console.log(
      `\nWritten. The live site shows the new ${Object.keys(changes).join(", ")} on its next load.`,
    );
  } finally {
    await store.close();
  }
};

if (require.main === module) {
  main().catch((err) => {
    const why =
      err.message === "fetch failed"
        ? `could not reach the site (${(err.cause && err.cause.code) || "network error"}) — check the connection and try again`
        : err.message;
    console.error(`sync-content: ${why}`);
    process.exit(1);
  });
}

module.exports = { plan, describe, mergeByKey, mergeLinks, loadDefaults };
