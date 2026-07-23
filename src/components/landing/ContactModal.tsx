import { useEffect, useRef, useState, type FormEvent } from "react";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  eyebrow?: string;
  intent?: string;
};

export function ContactModal({
  open,
  onClose,
  title = "Apply for Franchise Scout Access",
  eyebrow = "Membership Application",
  intent = "Franchise Scout",
}: ContactModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setSubmitted(false);
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const params = new URLSearchParams({
      subject: `${intent} application from ${data.get("name") ?? ""}`,
      body:
        `Name: ${data.get("name") ?? ""}\n` +
        `Organization: ${data.get("organization") ?? ""}\n` +
        `Email: ${data.get("email") ?? ""}\n` +
        `Phone: ${data.get("phone") ?? ""}\n\n` +
        `${data.get("message") ?? ""}`,
    });
    window.location.href = `mailto:chandra@olympicindoorsports.com?${params.toString()}`;
    setSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-ink-black/80 backdrop-blur-sm animate-in fade-in"
      />
      <div className="relative w-full max-w-xl bg-white text-ink-black shadow-2xl border-t-4 border-cricket-red max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 size-9 grid place-items-center text-ink-black hover:bg-ink-black hover:text-white transition-colors text-xl font-display"
        >
          ×
        </button>

        <div className="p-8 lg:p-10">
          <div className="font-mono text-[10px] text-cricket-red uppercase tracking-[0.3em] mb-3 font-bold">
            {eyebrow}
          </div>
          <h2
            id="contact-modal-title"
            className="font-display italic text-3xl lg:text-4xl uppercase leading-[0.95] mb-6"
          >
            {title}
          </h2>

          {submitted ? (
            <div className="space-y-4">
              <p className="text-ink-black">
                Your email client just opened with your application. If it did not, please email us
                directly:
              </p>
              <a
                href="mailto:chandra@olympicindoorsports.com"
                className="story-link text-cricket-red font-mono text-sm break-all"
              >
                chandra@olympicindoorsports.com
              </a>
              <button
                type="button"
                onClick={onClose}
                className="cta-press skew-tag mt-4 inline-block bg-ink-black text-white px-6 py-3 font-display uppercase italic text-sm tracking-widest hover:bg-cricket-red"
              >
                <span>Close</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="Full Name" name="name" required inputRef={firstFieldRef} />
              <Field label="Organization or Team" name="organization" />
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Email" name="email" type="email" required />
                <Field label="Phone" name="phone" type="tel" />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-[10px] font-mono uppercase tracking-widest text-ink-soft mb-2 font-bold"
                >
                  How can we help
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full border border-ink-black/20 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-cricket-red focus:ring-2 focus:ring-cricket-red/20"
                  placeholder="Tell us about your scouting needs."
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  className="cta-press skew-tag bg-cricket-red text-white px-6 py-3 font-display uppercase italic text-sm tracking-widest hover:bg-ink-black"
                >
                  <span>Send Application</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="cta-press skew-tag border border-ink-black/30 text-ink-black px-6 py-3 font-display uppercase italic text-sm tracking-widest hover:bg-ink-black hover:text-white"
                >
                  <span>Cancel</span>
                </button>
              </div>
              <p className="text-[11px] text-ink-soft pt-2">
                Submissions open your email client addressed to our team.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  inputRef,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-[10px] font-mono uppercase tracking-widest text-ink-soft mb-2 font-bold"
      >
        {label}
        {required ? <span className="text-cricket-red ml-1">*</span> : null}
      </label>
      <input
        ref={inputRef}
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full border border-ink-black/20 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-cricket-red focus:ring-2 focus:ring-cricket-red/20"
      />
    </div>
  );
}
