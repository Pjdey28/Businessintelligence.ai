"use client";

import type {
  Driver,
  OperationalDriver,
  Evidence,
} from "@/lib/types";

interface DriverInvestigationProps {
  driver: Driver | null;
  operationalDrivers: OperationalDriver[];
  evidence: Evidence[];
  onClose: () => void;
}

export default function DriverInvestigation({
  driver,
  operationalDrivers,
  evidence,
  onClose,
}: DriverInvestigationProps) {
  if (!driver) {
    return null;
  }

  const evidenceMatches = evidence.filter((item) => {
    const text = `${item.source} ${item.content}`.toLowerCase();
    const tokens = [
      driver.value.toLowerCase(),
      driver.dimension.toLowerCase(),
    ];
    return tokens.some((token) => text.includes(token));
  });

  const supportingSignals = operationalDrivers.slice(0, 3);

 return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-md transition-all">
      <div className="relative mx-auto my-8 w-full max-w-4xl overflow-hidden rounded-2xl border-2 border-indigo-400 bg-white shadow-2xl shadow-indigo-900/40 animate-in zoom-in-95 duration-200">
        {/* Colorful Top Accent */}
        <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500"></div>

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 bg-slate-50 px-8 py-6 pt-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Driver Drill-Down
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              {driver.value}
            </h2>
            <p className="mt-1 text-sm font-medium uppercase tracking-wide text-slate-500">
              {driver.dimension}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-100 hover:text-slate-900 hover:shadow-md"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
            Close
          </button>
        </div>

        {/* Contribution Stats */}
        <div className="grid gap-4 border-b border-slate-100 p-8 sm:grid-cols-3 bg-white">
          <Metric
            label="Contribution"
            value={`${driver.contribution_percentage.toFixed(1)}%`}
            accent="text-indigo-600"
          />
          <Metric
            label="Direction"
            value={capitalize(driver.direction)}
            accent={driver.direction === "increase" ? "text-emerald-600" : "text-rose-600"}
          />
          <Metric
            label="AI Confidence"
            value={capitalize(driver.confidence || "Medium")}
            accent="text-violet-600"
          />
        </div>

        {/* Analysis Body */}
        <div className="grid gap-8 p-8 lg:grid-cols-2 bg-slate-50">
          
          <div className="space-y-8">
            <div className="rounded-xl border border-indigo-100 bg-white p-6 shadow-sm">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-indigo-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Why this matters
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-700">
                {driver.explanation ||
                  `The ${driver.dimension.toLowerCase()} "${driver.value}" is contributing ${driver.contribution_percentage.toFixed(1)}% of the KPI movement and is trending ${driver.direction}. This is a meaningful business signal extracted from the analytics engine.`}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                Related Operational Signals
              </p>
              <div className="mt-4 space-y-3">
                {supportingSignals.length === 0 ? (
                  <p className="text-sm italic text-slate-500">No related operational signals found.</p>
                ) : (
                  supportingSignals.map((signal, index) => (
                    <div key={`${signal.driver}-${index}`} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 border border-slate-100">
                      <span className="font-semibold text-slate-700">{signal.driver}</span>
                      <div className="text-right">
                        <span className={`block font-black ${signal.correlation > 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                          {signal.correlation.toFixed(2)}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {signal.relationship}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-900 p-6 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Supporting Evidence
            </p>
            <h3 className="mt-1 text-xl font-bold text-white">
              Documents linked to this driver
            </h3>
            <div className="mt-5 space-y-4">
              {(evidenceMatches.length > 0 ? evidenceMatches : evidence.slice(0, 2)).map((item, index) => (
                <div key={`${item.source}-${index}`} className="rounded-lg border border-slate-700 bg-slate-800 p-4 transition-colors hover:border-indigo-500/50">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
                    <span className="text-sm font-bold text-indigo-300">{item.source}</span>
                    <span className="rounded bg-slate-700 px-2 py-1 text-xs font-bold text-slate-300">
                      {(item.relevance_score * 100).toFixed(0)}% Match
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {item.content}
                  </p>
                </div>
              ))}
              {evidence.length === 0 && (
                <p className="text-sm italic text-slate-500">No supporting text documents retrieved for this driver.</p>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-5 border border-slate-100">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className={`mt-2 text-3xl font-black tracking-tight ${accent}`}>
        {value}
      </p>
    </div>
  );
}

function capitalize(value: string): string {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}