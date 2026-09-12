"use client";

import { useMemo, useState } from "react";

type Copy = {
  presets: string;
  custom: string;
  amount: string;
  donate: string;
  secure: string;
  min: string;
  invalid: string;
  unavailable: string;
  failed: string;
};

export function DonateClient({ locale, currency = "USD", copy }: { locale: string; currency?: string; copy: Copy }) {
  const presets = [5, 10, 25, 50];
  const [amount, setAmount] = useState(10);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formatter = useMemo(() => new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }), [locale, currency]);
  const effective = custom === "" ? amount : Number(custom);

  async function submit() {
    setError("");
    if (!Number.isFinite(effective) || effective < 1 || effective > 10000) { setError(copy.invalid); return; }
    setLoading(true);
    try {
      const response = await fetch("/api/donate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: effective, locale }) });
      const data = await response.json() as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        setError(data.error === "donations_not_configured" ? copy.unavailable : copy.failed);
        return;
      }
      window.location.assign(data.url);
    } catch { setError(copy.failed); }
    finally { setLoading(false); }
  }

  return <div className="donatePanel">
    <span className="eyebrow">{copy.presets}</span>
    <div className="donatePresetGrid" aria-label={copy.presets}>{presets.map(value => <button type="button" className="donatePreset" aria-pressed={custom === "" && amount === value} key={value} onClick={() => { setAmount(value); setCustom(""); }}>{formatter.format(value)}</button>)}</div>
    <label className="donateCustom"><span>{copy.custom}</span><div className="donateAmountInput"><span>{currency}</span><input inputMode="decimal" type="number" min="1" max="10000" step="1" value={custom} placeholder={String(amount)} aria-label={copy.amount} onChange={(e) => setCustom(e.target.value)} /></div></label>
    <button type="button" className="button primary donateSubmit" disabled={loading} onClick={submit}>{loading ? "…" : `${copy.donate} · ${formatter.format(effective || amount)}`}</button>
    <p className="donateSecurity">🔒 {copy.secure}</p>
    <small className="muted">{copy.min}</small>
    {error && <p className="donateError" role="alert">{error}</p>}
  </div>;
}
