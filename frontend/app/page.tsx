"use client";

import { useEffect, useState } from "react";

import KPITrendChart from "@/components/investigation/KPITrendChart";
import CorrelationChart from "../components/investigation/CorrelationChart";
import EvidenceStrength from "../components/investigation/EvidenceStrength";
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
  const [kpi, setKpi] =
    useState("revenue");

  const [period, setPeriod] =
    useState("2025-08");

  const [investigation, setInvestigation] =
    useState<Investigation | null>(null);

  const [selectedDriver, setSelectedDriver] =
    useState<Driver | null>(null);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!investigation) {
      setSelectedDriver(null);
      return;
    }

    if (
      investigation.drivers.length === 0
    ) {
      setSelectedDriver(null);
      return;
    }

    setSelectedDriver((current) => {
      if (
        current &&
        investigation.drivers.some(
          (driver) =>
            driver.dimension ===
              current.dimension &&
            driver.value === current.value,
        )
      ) {
        return current;
      }

      return investigation.drivers[0];
    });
  }, [investigation]);

  const [error, setError] =
    useState<string | null>(null);

  async function handleInvestigate() {
    setLoading(true);
    setError(null);

    try {
      const response =
        await investigateKPI({
          kpi,
          period,
        });

      setInvestigation(
        response.investigation,
      );
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
    <main className="min-h-screen">

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              BusinessIntelligence.ai
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              AI-powered business investigation
            </p>
          </div>

          <div className="text-sm text-gray-500">
            Decision Intelligence
          </div>

        </div>
      </header>

      <section className="mx-auto max-w-7xl px-8 py-10">

        <div className="mb-8">

          <p className="mb-2 text-sm font-medium text-gray-500">
            BUSINESS INVESTIGATION
          </p>

          <h2 className="text-3xl font-semibold tracking-tight">
            Investigate business performance
          </h2>

          <p className="mt-2 max-w-2xl text-gray-600">
            Select a KPI and period to identify
            unusual movements, contributing
            business drivers, supporting evidence,
            and recommended actions.
          </p>

        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <div className="grid gap-5 md:grid-cols-3">

            <div>
              <label
                htmlFor="kpi"
                className="mb-2 block text-sm font-medium"
              >
                KPI
              </label>

              <select
                id="kpi"
                value={kpi}
                onChange={(event) =>
                  setKpi(event.target.value)
                }
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
              >
                {KPI_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="period"
                className="mb-2 block text-sm font-medium"
              >
                Period
              </label>

              <input
                id="period"
                type="month"
                value={period}
                onChange={(event) =>
                  setPeriod(event.target.value)
                }
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div className="flex items-end">

              <button
                onClick={handleInvestigate}
                disabled={loading}
                className="w-full rounded-lg bg-gray-900 px-5 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Investigating..."
                  : "Investigate KPI"}
              </button>

            </div>

          </div>

          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

        </div>

        {investigation && (
          <div className="mt-8">
            <InvestigationDashboard
              investigation={
                investigation
              }
              selectedDriver={
                selectedDriver
              }
              onSelectDriver={
                setSelectedDriver
              }
            />
          </div>
        )}

      </section>

    </main>
  );
}


function InvestigationDashboard({
  investigation,
  selectedDriver,
  onSelectDriver,
}: {
  investigation: Investigation;
  selectedDriver: Driver | null;
  onSelectDriver: (driver: Driver) => void;
}) {
  return (
    <div className="space-y-6">

      <div className="grid gap-5 md:grid-cols-3">

        <MetricCard
          label="Current KPI"
          value={formatNumber(
            investigation.kpi
              .current_value,
          )}
        />

        <MetricCard
          label="Previous Period"
          value={formatNumber(
            investigation.kpi
              .previous_value,
          )}
        />

        <MetricCard
          label="Period Change"
          value={`${investigation.kpi.percentage_change.toFixed(2)}%`}
          negative={
            investigation.kpi
              .percentage_change < 0
          }
          positive={
            investigation.kpi
              .percentage_change > 0
          }
        />

      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm font-medium text-gray-500">
              Executive Summary
            </p>

            <h3 className="mt-1 text-xl font-semibold">
              What changed?
            </h3>
          </div>

          <StatusBadge
            label={
              investigation.anomaly
                .is_anomaly
                ? "Anomaly detected"
                : "Within normal range"
            }
            active={
              investigation.anomaly
                .is_anomaly
            }
          />

        </div>

        <p className="mt-5 leading-7 text-gray-700">
          {
            investigation
              .executive_summary
          }
        </p>

      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        <div className="rounded-xl border bg-white p-6 shadow-sm lg:col-span-2">

          <p className="text-sm font-medium text-gray-500">
            PERFORMANCE TREND
          </p>

          <h3 className="mt-1 text-xl font-semibold">
            KPI trajectory
          </h3>

          <div className="mt-6">
            <KPITrendChart
              data={investigation.trend}
            />
          </div>

        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <p className="text-sm font-medium text-gray-500">
            INVESTIGATION QUALITY
          </p>

          <h3 className="mt-1 text-xl font-semibold">
            Evidence assessment
          </h3>

          <div className="mt-6">
            <EvidenceStrength
              strength={
                investigation.evidence_strength
              }
              confidence={
                investigation.confidence
              }
            />
          </div>

          {investigation.ambiguity && (
            <div className="mt-5 rounded-lg bg-gray-50 p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Remaining uncertainty
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {investigation.ambiguity}
              </p>

            </div>
          )}

        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <DriversPanel
          drivers={
            investigation.drivers
          }
          selectedDriver={
            selectedDriver
          }
          onSelectDriver={
            onSelectDriver
          }
        />

        <RootCausePanel
          rootCauses={
            investigation.root_causes
          }
        />

      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <p className="text-sm font-medium text-gray-500">
          OPERATIONAL ANALYSIS
        </p>

        <h3 className="mt-1 text-xl font-semibold">
          Relationship with operational drivers
        </h3>

        <p className="mt-2 max-w-2xl text-sm text-gray-500">
          Statistical relationships between the KPI
          and operational variables. These indicate
          association, not definitive causation.
        </p>

        <div className="mt-6">
          <CorrelationChart
            data={
              investigation.operational_drivers
            }
          />
        </div>

      </div>

      <EvidencePanel
        evidence={
          investigation.evidence
        }
      />

      <RecommendationsPanel
        recommendations={
          investigation
            .recommendations
        }
      />

    </div>
  );
}


function MetricCard({
  label,
  value,
  negative,
  positive,
}: {
  label: string;
  value: string;
  negative?: boolean;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-semibold ${
          negative
            ? "text-red-600"
            : positive
              ? "text-green-600"
              : "text-gray-900"
        }`}
      >
        {value}
      </p>

    </div>
  );
}


function DriversPanel({
  drivers,
  selectedDriver,
  onSelectDriver,
}: {
  drivers: Investigation["drivers"];
  selectedDriver: Driver | null;
  onSelectDriver: (driver: Driver) => void;
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <p className="text-sm font-medium text-gray-500">
        CONTRIBUTION ANALYSIS
      </p>

      <h3 className="mt-1 text-xl font-semibold">
        What drove the change?
      </h3>

      <div className="mt-6 space-y-5">

        {drivers.length === 0 ? (
          <p className="text-sm text-gray-500">
            No significant drivers were
            identified.
          </p>
        ) : (
          drivers.slice(0, 6).map(
            (driver, index) => {
              const isSelected =
                selectedDriver &&
                selectedDriver.dimension ===
                  driver.dimension &&
                selectedDriver.value ===
                  driver.value;

              return (
                <button
                  key={`${driver.dimension}-${driver.value}-${index}`}
                  type="button"
                  onClick={() => onSelectDriver(driver)}
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    isSelected
                      ? "border-gray-900 bg-gray-50"
                      : "border-transparent hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between text-sm">

                    <span className="font-medium">
                      {driver.value}
                    </span>

                    <span className="text-gray-500">
                      {driver.contribution_percentage.toFixed(
                        1,
                      )}
                      %
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">

                    <div
                      className="h-full rounded-full bg-gray-900"
                      style={{
                        width: `${Math.min(
                          driver.contribution_percentage,
                          100,
                        )}%`,
                      }}
                    />

                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    {driver.dimension} ·{" "}
                    {driver.direction}
                  </p>
                </button>
              );
            },
          )
        )}

      </div>

    </div>
  );
}


function DriverDetailPanel({
  driver,
  evidence,
  operationalDrivers,
}: {
  driver: Driver;
  evidence: Investigation["evidence"];
  operationalDrivers: Investigation["operational_drivers"];
}) {
  const evidenceMatches =
    evidence.filter((item) => {
      const text = `${item.source} ${item.content}`.toLowerCase();
      const tokens = [
        driver.value.toLowerCase(),
        driver.dimension.toLowerCase(),
      ];

      return tokens.some((token) =>
        text.includes(token),
      );
    });

  const supportingSignals =
    operationalDrivers.slice(0, 3);

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">
        DRIVER DRILL-DOWN
      </p>

      <h3 className="mt-1 text-xl font-semibold">
        {driver.value}
      </h3>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-gray-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Why this matters
          </p>

          <p className="mt-3 text-sm leading-6 text-gray-700">
            {driver.dimension} is contributing {driver.contribution_percentage.toFixed(1)}% of the KPI movement and is trending {driver.direction}. This is a meaningful business signal, but it should be interpreted as a contributing factor rather than a guaranteed causal explanation.
          </p>
        </div>

        <div className="rounded-lg border bg-gray-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Related operational signals
          </p>

          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {supportingSignals.length === 0 ? (
              <li>No related operational signals were identified.</li>
            ) : (
              supportingSignals.map((signal, index) => (
                <li key={`${signal.driver}-${index}`}>
                  {signal.driver}: {signal.relationship} ({signal.correlation.toFixed(2)})
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-gray-500">
          SUPPORTING EVIDENCE
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {(evidenceMatches.length > 0 ? evidenceMatches : evidence.slice(0, 2)).map((item, index) => (
            <div key={`${item.source}-${index}`} className="rounded-lg border p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">{item.source}</span>
                <span className="text-xs text-gray-500">
                  {(item.relevance_score * 100).toFixed(0)}%
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {item.content}
              </p>
            </div>
          ))}
        </div>
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
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <p className="text-sm font-medium text-gray-500">
        AI REASONING
      </p>

      <h3 className="mt-1 text-xl font-semibold">
        Why did it happen?
      </h3>

      <div className="mt-6 space-y-5">

        {rootCauses.length === 0 ? (
          <p className="text-sm text-gray-500">
            No sufficiently supported root
            cause was identified.
          </p>
        ) : (
          rootCauses.map(
            (cause, index) => (
              <div
                key={index}
                className="rounded-lg border p-4"
              >

                <div className="flex items-start justify-between gap-4">

                  <h4 className="font-semibold">
                    {cause.cause}
                  </h4>

                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium">
                    {cause.confidence}
                  </span>

                </div>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {cause.explanation}
                </p>

              </div>
            ),
          )
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
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <div>
        <p className="text-sm font-medium text-gray-500">
          EVIDENCE
        </p>

        <h3 className="mt-1 text-xl font-semibold">
          Supporting business evidence
        </h3>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">

        {evidence.map(
          (item, index) => (
            <div
              key={index}
              className="rounded-lg border p-4"
            >

              <div className="flex items-center justify-between">

                <span className="text-sm font-semibold">
                  {item.source}
                </span>

                <span className="text-xs text-gray-500">
                  {(item.relevance_score * 100).toFixed(
                    0,
                  )}
                  %
                </span>

              </div>

              <p className="mt-3 line-clamp-6 text-sm leading-6 text-gray-600">
                {item.content}
              </p>

            </div>
          ),
        )}

      </div>

    </div>
  );
}


function RecommendationsPanel({
  recommendations,
}: {
  recommendations:
    Investigation["recommendations"];
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <p className="text-sm font-medium text-gray-500">
        DECISION SUPPORT
      </p>

      <h3 className="mt-1 text-xl font-semibold">
        What should we do?
      </h3>

      <div className="mt-6 space-y-4">

        {recommendations.length === 0 ? (
          <p className="text-sm text-gray-500">
            No recommendation was generated.
          </p>
        ) : (
          recommendations.map(
            (recommendation, index) => (
              <div
                key={index}
                className="rounded-lg border p-5"
              >

                <div className="flex items-center justify-between gap-4">

                  <h4 className="font-semibold">
                    {recommendation.action}
                  </h4>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium uppercase">
                    {recommendation.priority}
                  </span>

                </div>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {recommendation.rationale}
                </p>

              </div>
            ),
          )
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
      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
        active
          ? "bg-red-50 text-red-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {label}
    </span>
  );
}


function formatNumber(
  value: number,
): string {
  return new Intl.NumberFormat(
    "en-IN",
    {
      maximumFractionDigits: 0,
    },
  ).format(value);
}