"use client";

import { useState } from "react";

import KPITrendChart from "@/components/investigation/KPITrendChart";
import CorrelationChart from "../components/investigation/CorrelationChart";
import EvidenceStrength from "../components/investigation/EvidenceStrength";
import DriverInvestigation from "@/components/investigation/DriverInvestigation";
import { investigateKPI } from "@/lib/api";

import type {
  Driver,
  Investigation,
} from "@/lib/types";

const KPI_OPTIONS = [
  { value: "revenue", label: "Revenue" },
  { value: "units_sold", label: "Units Sold" },
  { value: "customer_complaints", label: "Customer Complaints" },
  { value: "inventory_available", label: "Inventory Available" },
  { value: "stockout_rate", label: "Stockout Rate" },
  { value: "delivery_delay_rate", label: "Delivery Delay Rate" },
] as const;

export default function Home() {
  const [kpi, setKpi] = useState("revenue");
  const [period, setPeriod] = useState("2025-08");
  const [investigation, setInvestigation] = useState<Investigation | null>(null);

  const [selectedDriver, setSelectedDriver] = useState<Investigation["drivers"][number] | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // BUG FIX: The useEffect that auto-selected the driver has been completely removed.

  async function handleInvestigate() {
    setLoading(true);
    setError(null);
    setSelectedDriver(null); // Ensure modal is closed when a new search starts

    try {
      const response = await investigateKPI({
        kpi,
        period,
      });

      setInvestigation(response.investigation);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Investigation failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
              BusinessIntelligence.ai
            </h1>
            <p className="mt-1 text-sm text-indigo-200">
              AI-powered business investigation
            </p>
          </div>
          <div className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-indigo-100 backdrop-blur-sm border border-white/10">
            Decision Intelligence
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-8 py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold tracking-wider text-indigo-600">
            BUSINESS INVESTIGATION
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900">
            Investigate business performance
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">
            Select a KPI and period to identify unusual movements, contributing
            business drivers, supporting evidence, and recommended actions.
          </p>
        </div>

        <div className="rounded-2xl border border-white bg-white p-6 shadow-xl shadow-indigo-100">
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label
                htmlFor="kpi"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                KPI
              </label>
              <select
                id="kpi"
                value={kpi}
                onChange={(event) => setKpi(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
              >
                {KPI_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="period"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Period
              </label>
              <input
                id="period"
                type="month"
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleInvestigate}
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Investigating...
                  </span>
                ) : (
                  "Investigate KPI"
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700 shadow-inner">
              {error}
            </div>
          )}
        </div>

        {investigation && (
          <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <InvestigationDashboard
              investigation={investigation}
              onDriverSelect={setSelectedDriver}
            />
          </div>
        )}
        
        {selectedDriver && investigation && (
          <DriverInvestigation
            driver={selectedDriver}
            operationalDrivers={investigation.operational_drivers}
            evidence={investigation.evidence}
            onClose={() => setSelectedDriver(null)}
          />
        )}
      </section>
    </main>
  );
}

function InvestigationDashboard({
  investigation,
  onDriverSelect,
}: {
  investigation: Investigation;
  onDriverSelect: (driver: Investigation["drivers"][number]) => void;
}) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        <MetricCard
          label="Current KPI"
          value={formatNumber(investigation.kpi.current_value)}
        />
        <MetricCard
          label="Previous Period"
          value={formatNumber(investigation.kpi.previous_value)}
        />
        <MetricCard
          label="Period Change"
          value={`${investigation.kpi.percentage_change.toFixed(2)}%`}
          negative={investigation.kpi.percentage_change < 0}
          positive={investigation.kpi.percentage_change > 0}
          highlight
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold tracking-wider text-indigo-500">
              EXECUTIVE SUMMARY
            </p>
            <h3 className="mt-1 text-2xl font-bold text-slate-900">What changed?</h3>
          </div>
          <StatusBadge
            label={
              investigation.anomaly.is_anomaly
                ? "Anomaly detected"
                : "Within normal range"
            }
            active={investigation.anomaly.is_anomaly}
          />
        </div>
        <p className="mt-6 text-lg leading-relaxed text-slate-700 bg-slate-50 p-6 rounded-xl border border-slate-100">
          {investigation.executive_summary}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">
          <p className="text-sm font-bold tracking-wider text-indigo-500">
            PERFORMANCE TREND
          </p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">KPI trajectory</h3>
          <div className="mt-8">
            <KPITrendChart data={investigation.trend} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold tracking-wider text-indigo-500">
            INVESTIGATION QUALITY
          </p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">Evidence assessment</h3>
          <div className="mt-8">
            <EvidenceStrength
              strength={investigation.evidence_strength}
              confidence={investigation.confidence}
            />
          </div>
          {investigation.ambiguity && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-inner">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                Remaining uncertainty
              </p>
              <p className="mt-3 text-sm leading-relaxed text-amber-900">
                {investigation.ambiguity}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <DriversPanel
          drivers={investigation.drivers}
          onDriverSelect={onDriverSelect}
        />
        <RootCausePanel rootCauses={investigation.root_causes} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold tracking-wider text-indigo-500">
          OPERATIONAL ANALYSIS
        </p>
        <h3 className="mt-1 text-2xl font-bold text-slate-900">
          Relationship with operational drivers
        </h3>
        <p className="mt-3 max-w-3xl text-base text-slate-600">
          Statistical relationships between the KPI and operational variables.
          These indicate association, not definitive causation.
        </p>
        <div className="mt-8">
          <CorrelationChart data={investigation.operational_drivers} />
        </div>
      </div>

      <EvidencePanel evidence={investigation.evidence} />

      <RecommendationsPanel recommendations={investigation.recommendations} />
    </div>
  );
}

function MetricCard({
  label,
  value,
  negative,
  positive,
  highlight,
}: {
  label: string;
  value: string;
  negative?: boolean;
  positive?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md ${highlight ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200'}`}>
      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
      <p
        className={`mt-3 text-4xl font-black tracking-tight ${
          negative
            ? "text-rose-600"
            : positive
              ? "text-emerald-600"
              : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function DriversPanel({
  drivers,
  onDriverSelect,
}: {
  drivers: Investigation["drivers"];
  onDriverSelect: (driver: Investigation["drivers"][number]) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-bold tracking-wider text-indigo-500">
        CONTRIBUTION ANALYSIS
      </p>
      <div className="mt-1 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-900">What drove the change?</h3>
        {drivers.length > 0 && (
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 border border-indigo-100">Click to drill down</span>
        )}
      </div>

      <div className="mt-8 space-y-4">
        {drivers.length === 0 ? (
          <p className="text-base text-slate-500 italic p-4 bg-slate-50 rounded-xl">
            No significant drivers were identified.
          </p>
        ) : (
          drivers.slice(0, 6).map((driver, index) => (
            <button
              key={index}
              onClick={() => onDriverSelect(driver)}
              className="group w-full rounded-xl border border-slate-100 bg-slate-50 p-5 text-left transition-all hover:border-indigo-300 hover:bg-white hover:shadow-md hover:shadow-indigo-500/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{driver.value}</p>
                  <p className="mt-1 text-sm font-medium text-slate-500 uppercase tracking-wide">
                    {driver.dimension}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-slate-800">
                    {driver.contribution_percentage.toFixed(1)}%
                  </p>
                  <p className="mt-1 text-xs font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-1">
                    View analysis <span>&rarr;</span>
                  </p>
                </div>
              </div>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min(
                      Math.abs(driver.contribution_percentage),
                      100,
                    )}%`,
                  }}
                />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function RootCausePanel({
  rootCauses,
}: {
  rootCauses: Investigation["root_causes"];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-bold tracking-wider text-indigo-500">AI REASONING</p>
      <h3 className="mt-1 text-2xl font-bold text-slate-900">Why did it happen?</h3>
      <div className="mt-8 space-y-6">
        {rootCauses.length === 0 ? (
          <p className="text-base text-slate-500 italic p-4 bg-slate-50 rounded-xl">
            No sufficiently supported root cause was identified.
          </p>
        ) : (
          rootCauses.map((cause, index) => (
            <div key={index} className="rounded-xl border border-slate-100 bg-slate-50 p-6 transition-all hover:border-indigo-100 hover:bg-white hover:shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <h4 className="text-lg font-bold text-slate-800 leading-tight">{cause.cause}</h4>
                <span className="shrink-0 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 uppercase tracking-wide">
                  {cause.confidence}
                </span>
              </div>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                {cause.explanation}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function EvidencePanel({
  evidence,
}: {
  evidence: Investigation["evidence"];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-900 p-8 shadow-lg">
      <div>
        <p className="text-sm font-bold tracking-wider text-indigo-400">EVIDENCE</p>
        <h3 className="mt-1 text-2xl font-bold text-white">
          Supporting business evidence
        </h3>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {evidence.map((item, index) => (
          <div key={index} className="rounded-xl border border-slate-700 bg-slate-800 p-6 transition-all hover:border-indigo-500/50 hover:bg-slate-800/80">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
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
      </div>
    </div>
  );
}

function RecommendationsPanel({
  recommendations,
}: {
  recommendations: Investigation["recommendations"];
}) {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/50 to-white p-8 shadow-sm">
      <p className="text-sm font-bold tracking-wider text-indigo-600">DECISION SUPPORT</p>
      <h3 className="mt-1 text-2xl font-bold text-slate-900">What should we do?</h3>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {recommendations.length === 0 ? (
          <p className="text-base text-slate-500 italic">
            No recommendation was generated.
          </p>
        ) : (
          recommendations.map((recommendation, index) => (
            <div key={index} className="relative overflow-hidden rounded-xl border border-indigo-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-300">
              <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-indigo-500 to-violet-500"></div>
              <div className="flex items-center justify-between gap-4 ml-2">
                <h4 className="text-lg font-bold text-slate-900">{recommendation.action}</h4>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide border ${
                  recommendation.priority.toLowerCase() === 'high' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {recommendation.priority}
                </span>
              </div>
              <p className="mt-3 ml-2 text-base leading-relaxed text-slate-600">
                {recommendation.rationale}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatusBadge({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <span
      className={`rounded-full px-4 py-2 text-sm font-bold tracking-wide ${
        active ? "bg-rose-100 text-rose-700 border border-rose-200 shadow-sm" : "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"
      }`}
    >
      {label}
    </span>
  );
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
}