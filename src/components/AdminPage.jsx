import React, { useState } from "react";
import { IDENTITY } from "../data/site";

/* Sign in with the admin password, or with a 6-digit code once two-factor
   is set up. The password is kept for the session because the inbox,
   activity log and image upload routes authenticate with it. */
const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!password && code.length !== 6) {
      setError("Enter the password, or a 6-digit code from your authenticator.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, twoFactorCode: code || undefined, content: {} }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        localStorage.setItem("admin-auth", "true");
        if (password) localStorage.setItem("admin-password", password);
        window.location.href = "/admin/dashboard";
      } else {
        setError(data.details || data.error || "That didn't match.");
      }
    } catch (err) {
      setError("Couldn't reach the server. Check the connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="wrap flex min-h-[100svh] flex-col justify-center py-24">
      <div className="mx-auto w-full max-w-md">
        <div className="t-mono-xs flex items-center gap-3 text-ink-3">
          <span className="dot" aria-hidden="true" /> {IDENTITY.name} · Admin
        </div>
        <h1 className="t-display-md mt-4 text-ink">
          Sign <span className="serif-italic text-ink-2">in.</span>
        </h1>

        <form onSubmit={submit} className="mt-10 flex flex-col gap-6" aria-label="Admin sign in">
          <label className="block">
            <span className="t-mono-xs text-ink-2">Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              className="input mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <div className="t-mono-xs flex items-center gap-4 text-ink-3">
            <span className="h-px flex-1 bg-line" aria-hidden="true" />
            or
            <span className="h-px flex-1 bg-line" aria-hidden="true" />
          </div>

          <label className="block">
            <span className="t-mono-xs text-ink-2">Authenticator code</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength="6"
              placeholder="000000"
              className="input mt-1 font-mono text-[22px] tracking-[0.4em]"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
          </label>

          <div className="mt-2 flex flex-wrap items-center gap-4">
            <button type="submit" disabled={busy} className="btn btn-primary t-mono disabled:opacity-60">
              {busy ? "Checking…" : "Sign in"} <span className="arr" aria-hidden="true">{"→"}</span>
            </button>
            <a href="/" className="t-mono-xs link-u text-ink-2">
              Back to the site
            </a>
          </div>

          <p className="min-h-[1.5em] text-[13px] text-down-text" role="alert" aria-live="polite">
            {error}
          </p>
        </form>
      </div>
    </main>
  );
};

export default AdminLogin;
