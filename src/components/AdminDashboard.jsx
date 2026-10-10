import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { IDENTITY } from "../data/site";
import { getTheme, toggleTheme } from "../lib/theme";
import { SunMoon } from "./Nav";

/* ------------------------------------------------------------------------
   Small pieces in the site's own language: mono labels, hairline inputs,
   paper cards. No animation library, no icon library.
   --------------------------------------------------------------------- */

const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="t-mono-xs flex items-baseline justify-between gap-4 text-ink-2">
      <span>{label}</span>
      {hint && <span className="normal-case tracking-normal text-ink-3">{hint}</span>}
    </span>
    {children}
  </label>
);

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border hairline bg-surface p-6 md:p-7 ${className}`}>{children}</div>
);

const Section = ({ title, aside, children }) => (
  <section className="border-t hairline pt-8">
    <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
      <h2 className="t-display-sm text-ink">{title}</h2>
      {aside && <p className="t-mono-xs text-ink-3">{aside}</p>}
    </div>
    {children}
  </section>
);

const Remove = ({ onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className="t-mono-xs grid h-8 w-8 place-items-center rounded-full border hairline text-ink-3 transition-colors hover:border-down-text hover:text-down-text"
  >
    {"✕"}
  </button>
);

const AddButton = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="t-mono flex w-full items-center justify-center gap-3 rounded-2xl border border-dashed border-line-2 py-5 text-ink-2 transition-colors hover:border-ink hover:text-ink"
  >
    <span aria-hidden="true">+</span> {children}
  </button>
);

const Toggle = ({ on, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    onClick={() => onChange(!on)}
    className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors ${on ? "border-ink bg-ink" : "border-line-2 bg-canvas-2"}`}
  >
    <span className={`absolute top-[3px] h-5 w-5 rounded-full transition-transform ${on ? "translate-x-[22px] bg-canvas" : "translate-x-[3px] bg-ink-3"}`} />
  </button>
);

const fmtDate = (d) => {
  try {
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(d));
  } catch (e) {
    return String(d);
  }
};

const adminPassword = () => localStorage.getItem("admin-password") || "";

/* ------------------------------------------------------------------------
   The dashboard
   --------------------------------------------------------------------- */

const TABS = [
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "messages", label: "Inbox" },
  { id: "activity", label: "Activity" },
  { id: "settings", label: "Settings" },
];

const AdminDashboard = () => {
  const {
    projects, setProjects,
    services,
    experience, setExperience,
    maintenanceMode, setMaintenanceMode,
    visitorCount,
    socialLinks, setSocialLinks,
    has2FA,
    notifications, setNotifications,
    trackEvent,
  } = usePortfolio();

  const [tab, setTab] = useState("projects");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ text: "", kind: "" });
  const [messages, setMessages] = useState(null);
  const [logs, setLogs] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [setup2FA, setSetup2FA] = useState(null);
  const [setupCode, setSetupCode] = useState("");
  const [uploading, setUploading] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [dark, setDark] = useState(false);
  const statusTimer = useRef(null);

  const say = useCallback((text, kind = "ok", ms = 4000) => {
    clearTimeout(statusTimer.current);
    setStatus({ text, kind });
    if (ms) statusTimer.current = setTimeout(() => setStatus({ text: "", kind: "" }), ms);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("admin-auth");
    localStorage.removeItem("admin-password");
    window.location.href = "/admin";
  }, []);

  /* signed in? and sign out after five idle minutes */
  useEffect(() => {
    if (!localStorage.getItem("admin-auth")) {
      window.location.href = "/admin";
      return undefined;
    }
    setDark(getTheme() === "dark");
    let timer;
    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(logout, 5 * 60 * 1000);
    };
    arm();
    const events = ["mousemove", "keydown", "click", "touchstart", "scroll"];
    events.forEach((ev) => window.addEventListener(ev, arm, { passive: true }));
    return () => {
      clearTimeout(timer);
      events.forEach((ev) => window.removeEventListener(ev, arm));
    };
  }, [logout]);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/messages", { headers: { password: adminPassword() } });
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
      else say(data.error === "Unauthorized" ? "Sign in with the password to read the inbox." : "Couldn't load messages.", "err");
    } catch (err) {
      say("Couldn't load messages.", "err");
    }
  }, [say]);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/analytics", { headers: { password: adminPassword() } });
      const data = await res.json();
      if (Array.isArray(data)) setLogs(data);
      else say(data.error === "Unauthorized" ? "Sign in with the password to see activity." : "Couldn't load activity.", "err");
    } catch (err) {
      say("Couldn't load activity.", "err");
    }
  }, [say]);

  useEffect(() => {
    if (tab === "messages" && messages === null) fetchMessages();
    if (tab === "activity" && logs === null) fetchLogs();
  }, [tab, messages, logs, fetchMessages, fetchLogs]);

  /* ---- projects ---- */
  const changeProject = (id, field, value) => setProjects(projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  const addProject = () => setProjects([...projects, { id: Date.now().toString(), title: "New project", description: "", image: "", link: "" }]);
  const removeProject = (id) => {
    if (window.confirm("Remove this project from the list?")) setProjects(projects.filter((p) => p.id !== id));
  };

  /* resize in the browser so nothing over ~200 KB reaches the database */
  const compressImage = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const max = 1200;
          let { width, height } = img;
          if (width > height && width > max) { height *= max / width; width = max; }
          else if (height >= width && height > max) { width *= max / height; height = max; }
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(width);
          canvas.height = Math.round(height);
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.78));
        };
        img.onerror = reject;
        img.src = ev.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const uploadImage = async (projectId, file) => {
    if (!file) return;
    setUploading(projectId);
    setUploadError("");
    try {
      const image = await compressImage(file);
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json", password: adminPassword() },
        body: JSON.stringify({ image, fileName: file.name }),
      });
      const data = await res.json();
      if (data.success) changeProject(projectId, "image", data.url);
      else setUploadError(data.error || "Upload failed");
    } catch (err) {
      setUploadError("Couldn't read or upload that image.");
    } finally {
      setUploading(null);
    }
  };

  /* ---- experience ---- */
  const changeExperience = (id, field, value) => setExperience(experience.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  const addExperience = () => setExperience([...experience, { id: Date.now(), role: "Role", company: "Company", duration: "Jan 2026 – Present", description: "", tech: [] }]);
  const removeExperience = (id) => {
    if (window.confirm("Remove this role?")) setExperience(experience.filter((x) => x.id !== id));
  };

  /* ---- inbox ---- */
  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/messages?id=${id}`, { method: "DELETE", headers: { password: adminPassword() } });
      if (res.ok) setMessages((m) => m.filter((x) => x._id !== id));
      else say("Couldn't delete that message.", "err");
    } catch (err) {
      say("Couldn't delete that message.", "err");
    }
  };

  /* ---- settings ---- */
  const start2FA = async () => {
    try {
      const res = await fetch("/api/2fa", { headers: { password: adminPassword() } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't start setup");
      setSetup2FA(data);
    } catch (err) {
      say(`${err.message}. Two-factor setup needs the live site or \`vercel dev\`.`, "err", 8000);
    }
  };

  const confirm2FA = async (code) => {
    setSetupCode(code);
    if (code.length !== 6) return;
    const res = await fetch("/api/2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json", password: adminPassword() },
      body: JSON.stringify({ secret: setup2FA.secret, code }),
    });
    if (res.ok) window.location.reload();
    else say("That code didn't match. Try the next one.", "err");
  };

  const disable2FA = async () => {
    if (!window.confirm("Turn off two-factor? The password alone will sign in.")) return;
    await fetch("/api/2fa", { method: "DELETE", headers: { password: adminPassword() } });
    window.location.reload();
  };

  const testWebhook = async () => {
    say("Sending a test event…", "ok", 0);
    try {
      await trackEvent("portfolio_visit", { ref: "DashboardTestWebhook" });
      say("Test event sent — check Discord or Telegram.");
    } catch (err) {
      say("The test event failed.", "err");
    }
  };

  const saveAll = async () => {
    if (has2FA && twoFactorCode.length !== 6) {
      say("Enter a fresh 6-digit code to save.", "err");
      return;
    }
    setSaving(true);
    say("Saving…", "ok", 0);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: adminPassword(),
          twoFactorCode: has2FA ? twoFactorCode : undefined,
          content: {
            projects,
            services,
            experience,
            maintenanceMode,
            socialLinks,
            notifications,
            ...(newPassword && { adminPassword: newPassword }),
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (newPassword) {
          localStorage.setItem("admin-password", newPassword);
          setNewPassword("");
        }
        setTwoFactorCode("");
        say("Saved. The site is live with these changes.");
      } else {
        say(`Not saved: ${data.details || data.error || "unknown error"}`, "err", 8000);
      }
    } catch (err) {
      say("Not saved: network error.", "err", 8000);
    } finally {
      setSaving(false);
    }
  };

  /* ---- tabs (plain functions, not components, so inputs keep focus between renders) ---- */

  const renderProjects = () => (
    <div className="flex flex-col gap-6">
      <p className="t-body max-w-[40em] text-ink-2">
        The four curated projects are always on the site; edit their text, image and link here. Anything you add appears after them.
      </p>
      {projects.map((p, i) => (
        <Card key={p.id}>
          <div className="flex items-start justify-between gap-4">
            <span className="t-mono-xs text-ink-3">{String(i + 1).padStart(2, "0")}</span>
            <Remove onClick={() => removeProject(p.id)} label={`Remove ${p.title}`} />
          </div>
          <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="Title">
              <input className="input input-lg mt-1" value={p.title} onChange={(e) => changeProject(p.id, "title", e.target.value)} />
            </Field>
            <Field label="Link" hint="repo or live URL">
              <input className="input mt-1" value={p.link || ""} onChange={(e) => changeProject(p.id, "link", e.target.value)} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Description">
                <textarea rows="4" className="input mt-1 resize-y" value={p.description} onChange={(e) => changeProject(p.id, "description", e.target.value)} />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Image" hint="1200 × 675 looks best">
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <div className="grid h-14 w-24 shrink-0 place-items-center overflow-hidden rounded-lg border hairline bg-canvas-2">
                    {p.image ? (
                      <img src={p.image} alt="" width="96" height="56" className="h-full w-full object-cover" />
                    ) : (
                      <span className="t-mono-xs text-ink-3">none</span>
                    )}
                  </div>
                  <input className="input min-w-[12rem] flex-1" placeholder="/images/name.webp or an uploaded URL" value={p.image || ""} onChange={(e) => changeProject(p.id, "image", e.target.value)} />
                  <label className="btn btn-secondary t-mono cursor-pointer">
                    {uploading === p.id ? "Uploading…" : "Upload"}
                    <input type="file" accept="image/*" className="sr-only" disabled={uploading !== null} onChange={(e) => uploadImage(p.id, e.target.files?.[0])} />
                  </label>
                </div>
                {uploadError && uploading === null && <p className="mt-2 text-[13px] text-down-text">{uploadError}</p>}
              </Field>
            </div>
          </div>
        </Card>
      ))}
      <AddButton onClick={addProject}>Add a project</AddButton>
    </div>
  );

  const renderExperience = () => (
    <div className="flex flex-col gap-6">
      {experience.map((x, i) => (
        <Card key={x.id}>
          <div className="flex items-start justify-between gap-4">
            <span className="t-mono-xs text-ink-3">{String(i + 1).padStart(2, "0")}</span>
            <Remove onClick={() => removeExperience(x.id)} label={`Remove ${x.company}`} />
          </div>
          <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="Company">
              <input className="input input-lg mt-1" value={x.company} onChange={(e) => changeExperience(x.id, "company", e.target.value)} />
            </Field>
            <Field label="Role">
              <input className="input mt-1" value={x.role} onChange={(e) => changeExperience(x.id, "role", e.target.value)} />
            </Field>
            <Field label="Dates" hint="e.g. Jul 2025 – Aug 2026">
              <input className="input mt-1" value={x.duration} onChange={(e) => changeExperience(x.id, "duration", e.target.value)} />
            </Field>
            <Field label="Tech" hint="comma separated">
              <input
                className="input mt-1"
                value={(x.tech || []).join(", ")}
                onChange={(e) => changeExperience(x.id, "tech", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="What you did there">
                <textarea rows="4" className="input mt-1 resize-y" value={x.description} onChange={(e) => changeExperience(x.id, "description", e.target.value)} />
              </Field>
            </div>
          </div>
        </Card>
      ))}
      <AddButton onClick={addExperience}>Add a role</AddButton>
    </div>
  );

  const renderInbox = () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="t-mono-xs text-ink-3">{messages ? `${messages.length} message${messages.length === 1 ? "" : "s"} · newest first` : "Loading…"}</p>
        <button type="button" onClick={fetchMessages} className="t-mono-xs link-u text-ink">Refresh</button>
      </div>
      {messages && messages.length === 0 && <p className="t-body text-ink-2">Nothing yet. Messages from the contact form land here.</p>}
      {(messages || []).map((m) => (
        <Card key={m._id}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[16px] text-ink">{m.name || m.author || "Anonymous"}</div>
              {m.email && (
                <a href={`mailto:${m.email}`} className="link-u text-[14px] text-ink-2">{m.email}</a>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="t-mono-xs whitespace-nowrap text-ink-3">{fmtDate(m.createdAt)}</span>
              <Remove onClick={() => deleteMessage(m._id)} label="Delete message" />
            </div>
          </div>
          <p className="t-body mt-5 whitespace-pre-wrap border-t hairline pt-5 text-ink-2">{m.message || m.text}</p>
        </Card>
      ))}
    </div>
  );

  const eventLabel = (log) => {
    switch (log.event) {
      case "portfolio_visit": return "Visit";
      case "resume_view": return "Résumé opened";
      case "resume_view_duration": return `Résumé read · ${log.metadata?.duration ?? "?"}s`;
      case "resume_download": return "Résumé download";
      default: return log.event;
    }
  };

  const renderActivity = () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="t-mono-xs text-ink-3">{logs ? `Last ${logs.length} events` : "Loading…"}</p>
        <button type="button" onClick={fetchLogs} className="t-mono-xs link-u text-ink">Refresh</button>
      </div>
      {logs && logs.length === 0 && <p className="t-body text-ink-2">No activity yet. Visits and résumé opens show up here; links with ?ref=name tell you who came.</p>}
      {logs && logs.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border hairline bg-surface">
          <table className="w-full border-collapse text-left text-[13px] text-ink-2">
            <thead>
              <tr className="t-mono-xs border-b hairline text-ink-3">
                {["When", "Event", "Company / ISP", "Location", "Ref", "Device"].map((h) => (
                  <th key={h} className="px-4 py-3 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b hairline last:border-b-0">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[12px]">{fmtDate(log.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`tag t-mono-xs ${log.event === "portfolio_visit" ? "" : "border-ink text-ink"}`}>{eventLabel(log)}</span>
                  </td>
                  <td className="px-4 py-3 text-ink">{log.company || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3">{[log.location?.city, log.location?.country].filter(Boolean).join(", ") || "Unknown"}</td>
                  <td className="px-4 py-3 font-mono text-[12px]">{log.metadata?.ref || log.metadata?.source || <span className="text-ink-3">direct</span>}</td>
                  <td className="whitespace-nowrap px-4 py-3">{[log.device?.os, log.device?.browser].filter(Boolean).join(" · ") || "Unknown"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="flex flex-col gap-12">
      <Section title="Traffic">
        <Card className="flex items-end justify-between gap-6">
          <div>
            <div className="t-mono-xs text-ink-3">Page loads · all time</div>
            <div className="t-display-md mt-2 tabular-nums text-ink">{Number(visitorCount || 0).toLocaleString("en-IN")}</div>
          </div>
          <div className="t-mono-xs max-w-[22em] text-right text-ink-3">Counts every load of the content API, including your own.</div>
        </Card>
      </Section>

      <Section title="Maintenance mode" aside={maintenanceMode ? "ON · visitors see the maintenance page" : "OFF · site is public"}>
        <Card className="flex items-center gap-5">
          <Toggle on={maintenanceMode} onChange={setMaintenanceMode} label="Maintenance mode" />
          <p className="t-body text-ink-2">Hides the site behind a “back shortly” page. The admin stays reachable. Takes effect when you save.</p>
        </Card>
      </Section>

      <Section title="Links">
        <Card>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {["github", "linkedin", "email", "instagram", "twitter"].map((key) => (
              <Field key={key} label={key === "email" ? "Email (mailto:)" : key}>
                <input className="input mt-1" value={socialLinks[key] || ""} onChange={(e) => setSocialLinks({ ...socialLinks, [key]: e.target.value })} />
              </Field>
            ))}
          </div>
        </Card>
      </Section>

      <Section title="Security" aside={has2FA ? "Two-factor is on" : "Two-factor is off"}>
        <Card className="flex flex-col gap-8">
          <Field label="New password" hint="leave blank to keep the current one">
            <input type="password" autoComplete="new-password" className="input mt-1" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </Field>

          <div className="border-t hairline pt-6">
            <div className="t-mono-xs text-ink-2">Two-factor authentication</div>
            {has2FA ? (
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <p className="t-body text-ink-2">Every save needs a fresh code from your authenticator app.</p>
                <button type="button" onClick={disable2FA} className="btn btn-secondary t-mono">Turn off</button>
              </div>
            ) : !setup2FA ? (
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <p className="t-body text-ink-2">Add Google Authenticator or any TOTP app as a second step.</p>
                <button type="button" onClick={start2FA} className="btn btn-secondary t-mono">Set up</button>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr] md:items-center">
                <img src={setup2FA.qrCodeUrl} alt="Scan this QR code with your authenticator app" width="176" height="176" className="rounded-lg border hairline bg-white p-2" />
                <div>
                  <p className="t-body text-ink-2">Scan the code, or enter this secret by hand, then type the 6 digits the app shows.</p>
                  <code className="mt-2 block break-all font-mono text-[12px] text-ink-3">{setup2FA.secret}</code>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength="6"
                    placeholder="000000"
                    className="input mt-4 max-w-[12rem] font-mono text-[22px] tracking-[0.4em]"
                    value={setupCode}
                    onChange={(e) => confirm2FA(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>
            )}
          </div>
          <p className="t-mono-xs text-ink-3">Once a password is saved here, the ADMIN_PASSWORD environment variable only works as a fallback if the database is reset.</p>
        </Card>
      </Section>

      <Section title="Alerts" aside="a message when someone visits or opens the résumé">
        <Card className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="Discord webhook URL">
              <input className="input mt-1" placeholder="https://discord.com/api/webhooks/…" value={notifications.discordWebhookUrl || ""} onChange={(e) => setNotifications({ ...notifications, discordWebhookUrl: e.target.value })} />
            </Field>
            <div className="flex flex-col gap-6">
              <Field label="Telegram bot token">
                <input type="password" autoComplete="off" className="input mt-1" placeholder="123456789:ABC…" value={notifications.telegramBotToken || ""} onChange={(e) => setNotifications({ ...notifications, telegramBotToken: e.target.value })} />
              </Field>
              <Field label="Telegram chat ID">
                <input className="input mt-1" placeholder="-10012345678" value={notifications.telegramChatId || ""} onChange={(e) => setNotifications({ ...notifications, telegramChatId: e.target.value })} />
              </Field>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t hairline pt-5">
            <p className="t-mono-xs max-w-[36em] text-ink-3">Tokens are stored in the database and never sent to the public page. Save first, then test.</p>
            <button type="button" onClick={testWebhook} className="btn btn-secondary t-mono">Send a test</button>
          </div>
        </Card>
      </Section>
    </div>
  );

  return (
    <main className="min-h-[100svh]">
      <header className="sticky top-0 z-40 border-b hairline bg-canvas/85 backdrop-blur-md">
        <div className="wrap flex min-h-[var(--nav-h)] flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3">
          <div className="t-mono-xs flex items-center gap-3 text-ink">
            <span className="dot" aria-hidden="true" />
            <span>{IDENTITY.name} · Admin</span>
            <a href="/" target="_blank" rel="noopener noreferrer" className="link-u text-ink-2">View site {"↗"}</a>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {has2FA && (
              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="2FA code"
                aria-label="Two-factor code to authorise saving"
                className="input py-2 font-mono text-[14px] tracking-[0.2em]"
                style={{ width: "7.5rem" }}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
              />
            )}
            <button type="button" onClick={saveAll} disabled={saving} className="btn btn-primary t-mono disabled:opacity-60">
              {saving ? "Saving…" : "Save live"}
            </button>
            <button
              type="button"
              onClick={() => setDark(toggleTheme() === "dark")}
              aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
              className="t-mono-xs grid h-9 w-9 place-items-center rounded-full border hairline text-ink"
            >
              <SunMoon dark={dark} />
            </button>
            <button type="button" onClick={logout} className="t-mono-xs link-u text-ink-2">Sign out</button>
          </div>
        </div>
      </header>

      <div className="wrap py-10 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="t-mono-xs text-ink-3">Dashboard</div>
            <h1 className="t-display-md mt-2 text-ink">
              Edit, then <span className="serif-italic text-ink-2">save live.</span>
            </h1>
          </div>
          <p className={`min-h-[1.5em] text-[14px] ${status.kind === "err" ? "text-down-text" : "text-ink-2"}`} role="status" aria-live="polite">
            {status.text}
          </p>
        </div>

        <nav aria-label="Dashboard sections" className="no-scrollbar mt-10 flex gap-2 overflow-x-auto border-b hairline pb-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? "page" : undefined}
              className={`pill t-mono-xs shrink-0 ${tab === t.id ? "pill-on" : ""}`}
            >
              {t.label}
              {t.id === "messages" && messages && messages.length > 0 && <span className="opacity-60">{messages.length}</span>}
            </button>
          ))}
        </nav>

        <div className="mt-8">
          {tab === "projects" && renderProjects()}
          {tab === "experience" && renderExperience()}
          {tab === "messages" && renderInbox()}
          {tab === "activity" && renderActivity()}
          {tab === "settings" && renderSettings()}
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
