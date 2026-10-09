import React from "react";

/* Small, boring primitives. Every section is built from these so the page
   has one voice: a mono eyebrow, a display heading, an aside, tags, buttons. */

export const Eyebrow = ({ children, className = "" }) => (
  <div className={`eyebrow t-mono ${className}`}>{children}</div>
);

export const SectionHeader = ({
  eyebrow,
  title,
  aside,
  titleClass = "t-display-md",
  id,
}) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
    <div className="md:col-span-8">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className={`${titleClass} mt-4 max-w-[12.5em] text-ink reveal`}
      >
        {title}
      </h2>
    </div>
    {aside && (
      <p className="t-body max-w-[32em] text-ink-2 md:col-span-4 md:self-end reveal reveal-d1">
        {aside}
      </p>
    )}
  </div>
);

export const Tag = ({ children }) => (
  <span className="tag t-mono-xs">{children}</span>
);

export const Arrow = ({ dir = "right", className = "" }) => {
  const glyph = { right: "→", up: "↑", ext: "↗", left: "←", down: "↓" }[dir];
  return (
    <span className={`arr ${className}`} aria-hidden="true">
      {glyph}
    </span>
  );
};

export const Button = ({
  as: Tag = "a",
  variant = "primary",
  children,
  className = "",
  ...rest
}) => (
  <Tag className={`btn btn-${variant} t-mono ${className}`} {...rest}>
    {children}
  </Tag>
);

export const Ext = ({ href, children, className = "" }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`arrow-link t-mono ${className}`}
  >
    <span className="link-u">{children}</span>
    <Arrow dir="ext" />
  </a>
);

export const Hairline = ({ className = "" }) => (
  <hr className={`hairline border-t ${className}`} />
);
