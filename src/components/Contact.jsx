import React, { useRef, useState } from "react";
import { CONTACT, IDENTITY } from "../data/site";
import { usePortfolio } from "../context/PortfolioContext";
import { Eyebrow, Button, Arrow } from "./ui";

const EMAILJS = {
  service: "service_ryfoaqn",
  template: "template_vw4a6gu",
  user: "7q-uiXHo9f6scXtuS",
};

const Contact = () => {
  const { setShowResume } = usePortfolio();
  const form = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  const send = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    const fd = new FormData(form.current);
    const data = {
      name: (fd.get("name") || "").toString().trim(),
      email: (fd.get("email") || "").toString().trim(),
      message: (fd.get("message") || "").toString().trim(),
    };
    if (!data.name || !data.email || !data.message) {
      setStatus("error");
      setError("Please fill in all three fields.");
      return;
    }

    setStatus("sending");
    setError("");

    /* Two independent channels. The message counts as delivered if EITHER
       lands, so a database outage never silently swallows a message. The
       email library is loaded only now, so it is not in the page bundle. */
    const saved = fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((r) => r.ok)
      .catch(() => false);

    const mailed = import("emailjs-com")
      .then(({ default: emailjs }) =>
        emailjs.sendForm(
          EMAILJS.service,
          EMAILJS.template,
          form.current,
          EMAILJS.user,
        ),
      )
      .then(() => true)
      .catch(() => false);

    const [didSave, didMail] = await Promise.all([saved, mailed]);
    if (didSave || didMail) {
      setStatus("sent");
      form.current.reset();
      setTimeout(() => setStatus("idle"), 8000);
    } else {
      setStatus("error");
      setError(`Couldn't send that. Email me directly at ${IDENTITY.email}.`);
    }
  };

  return (
    <section
      id="contact"
      className="wrap scroll-mt-24 border-t hairline pb-10 pt-24 md:pt-32"
      aria-labelledby="contact-title"
    >
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <Eyebrow>Contact</Eyebrow>
          <h2
            id="contact-title"
            className="t-display-md mt-4 max-w-[12.5em] text-ink reveal"
          >
            {CONTACT.heading}
          </h2>
          <p className="t-lede mt-6 max-w-[30em] text-ink-2 reveal reveal-d1">
            {CONTACT.body}
          </p>

          <div className="mt-8 flex flex-wrap gap-3 reveal reveal-d2">
            <Button href={`mailto:${IDENTITY.email}`}>
              {IDENTITY.email} <Arrow dir="ext" />
            </Button>
            <Button href={IDENTITY.phoneHref} variant="secondary">
              {IDENTITY.phone}
            </Button>
            <Button
              as="button"
              type="button"
              variant="secondary"
              onClick={() => setShowResume(true)}
            >
              Résumé (PDF)
            </Button>
          </div>

          <dl className="mt-10 grid max-w-[36em] grid-cols-2 gap-6 reveal reveal-d3">
            <div className="border-t hairline pt-4">
              <dt className="t-mono-xs text-ink-3">LinkedIn</dt>
              <dd className="mt-1.5">
                <a
                  href={IDENTITY.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-u text-[15px] text-ink"
                >
                  {IDENTITY.linkedinHandle}
                </a>
              </dd>
            </div>
            <div className="border-t hairline pt-4">
              <dt className="t-mono-xs text-ink-3">GitHub</dt>
              <dd className="mt-1.5">
                <a
                  href={IDENTITY.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-u text-[15px] text-ink"
                >
                  {IDENTITY.githubHandle}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <form
          ref={form}
          onSubmit={send}
          className="md:col-span-5 reveal reveal-d1"
          aria-label="Send me a message"
        >
          <div className="t-mono-xs text-ink-3">Or leave a message here</div>
          <div className="mt-6 flex flex-col gap-5">
            <label className="block">
              <span className="t-mono-xs text-ink-2">Your name</span>
              <input
                type="text"
                name="name"
                required
                autoComplete="name"
                className="input mt-1"
              />
            </label>
            <label className="block">
              <span className="t-mono-xs text-ink-2">Your email</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="input mt-1"
              />
            </label>
            <label className="block">
              <span className="t-mono-xs text-ink-2">Message</span>
              <textarea
                name="message"
                rows="4"
                required
                className="input mt-1 resize-y"
              />
            </label>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button
              as="button"
              type="submit"
              disabled={status === "sending"}
              className="disabled:opacity-60"
            >
              {status === "sending"
                ? "Sending…"
                : status === "sent"
                  ? "Sent ✓"
                  : "Send message"}
              {status === "idle" && <Arrow />}
            </Button>
            <p
              className="text-[13px] text-ink-2"
              role="status"
              aria-live="polite"
            >
              {status === "error" && error}
              {status === "sent" &&
                `Thanks — that reached me. I'll reply from ${IDENTITY.email}.`}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
