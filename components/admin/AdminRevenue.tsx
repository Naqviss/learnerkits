"use client";

import { useCallback, useEffect, useState } from "react";
import { adminCall, formatPaddleAmount } from "./admin-client";
import styles from "./admin.module.css";

type RevenueReport = {
  mode: "sandbox" | "live"; since: string; generatedAt: string; truncated: boolean;
  totals: Record<string, { transactions: number; earnings: number; gross: number }>;
  months: Record<string, Record<string, number>>;
  transactions: { id: string; billedAt: string; earnings: number | null; total: number | null; currency: string }[];
};

function monthsForChart() {
  const now = new Date();
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (11 - index), 1));
    return { key: date.toISOString().slice(0, 7), label: new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" }).format(date) };
  });
}

export function AdminRevenue({ token, onUnauthorized }: { token: string; onUnauthorized: () => void }) {
  const [report, setReport] = useState<RevenueReport | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true); setError("");
    const result = await adminCall<RevenueReport>(token, "revenue");
    if (result.ok) setReport(result.data);
    else { setError(result.error); if (result.status === 401) onUnauthorized(); }
    setLoading(false);
  }, [token, onUnauthorized]);
  useEffect(() => { void load(); }, [load]);

  if (loading && !report) return <section className={styles.card}><p>Loading Paddle revenue…</p></section>;
  if (error && !report) return <section className={styles.card}><div className={styles.toolbar}><h2>Revenue report</h2><button className={styles.action} type="button" onClick={() => void load()}>Retry</button></div><div className={styles.warning}>{error}</div></section>;
  if (!report) return null;
  const currencies = Object.keys(report.totals);
  const chartMonths = monthsForChart();
  const since = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(report.since));
  return <div className={styles.dash}>
    <header className={styles.overviewHero}><div><span className="eyebrow">Paddle · {report.mode} mode</span><h2>Revenue overview</h2><p>Completed transactions and Paddle payout earnings since {since}. Amounts are grouped by payout currency.</p></div><button className={styles.action} type="button" onClick={() => void load()}>↻ Refresh data</button></header>
    {error && <div className={styles.warning}>{error}</div>}
    {report.truncated && <div className={styles.warning}>This report reached its 2,400 transaction retrieval limit. Values may be incomplete for this period.</div>}
    {!currencies.length ? <div className={styles.empty}>No completed Paddle transactions were found for the last 12 months.</div> : <>
      <div className={styles.revenueTotals}>{currencies.map((currency) => { const total = report.totals[currency]; return <article className={styles.revenueTotal} key={currency}><small>Net payout earnings · {currency}</small><strong>{formatPaddleAmount(total.earnings, currency)}</strong><span>{formatPaddleAmount(total.gross, currency)} gross · {total.transactions} completed transactions</span></article>; })}</div>
      {currencies.map((currency) => {
        const values = chartMonths.map(({ key }) => report.months[key]?.[currency] ?? 0);
        const maximum = Math.max(...values, 1);
        return <section className={styles.card} key={currency} aria-label={`${currency} monthly payout earnings`}><div className={styles.toolbar}><div><h2>Monthly payout earnings</h2><span className={styles.subtle}>Last 12 months · {currency}</span></div></div><div className={styles.chart}>{chartMonths.map((month, index) => <div className={styles.chartColumn} key={month.key} title={`${month.label}: ${formatPaddleAmount(values[index], currency)}`}><span className={styles.bar} style={{ height: `${values[index] > 0 ? Math.max(5, (values[index] / maximum) * 100) : 2}%` }} /><small>{month.label}</small></div>)}</div></section>;
      })}
    </>}
    <section className={styles.card}><div className={styles.toolbar}><div><h2>Latest completed transactions</h2><span className={styles.subtle}>Up to 30 recent transactions</span></div></div>{report.transactions.length ? <div className={styles.tableScroll}><table className={styles.dataTable}><thead><tr><th>Transaction</th><th>Billed</th><th>Gross</th><th>Net earnings</th></tr></thead><tbody>{report.transactions.map((item) => <tr key={item.id}><td>{item.id}</td><td>{new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(item.billedAt))}</td><td>{item.total == null ? "—" : formatPaddleAmount(item.total, item.currency)}</td><td>{item.earnings == null ? "Processing" : formatPaddleAmount(item.earnings, item.currency)}</td></tr>)}</tbody></table></div> : <div className={styles.empty}>No completed transactions in this period.</div>}<p className={styles.subtle} style={{ margin: "12px 0 0" }}>Paddle data refreshed {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(report.generatedAt))}. For invoices, refunds and account-level reconciliation, use Paddle.</p></section>
  </div>;
}
