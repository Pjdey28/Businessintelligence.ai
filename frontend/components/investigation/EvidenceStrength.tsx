interface EvidenceStrengthProps {
  strength: "high" | "medium" | "low";
  confidence: "high" | "medium" | "low";
}

export default function EvidenceStrength({
  strength,
  confidence,
}: EvidenceStrengthProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <StrengthCard
        label="Evidence Strength"
        value={strength}
      />

      <StrengthCard
        label="AI Confidence"
        value={confidence}
      />
    </div>
  );
}

function StrengthCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <div className="mt-3 flex items-center gap-3">
        <div
          className={`h-3 w-3 rounded-full ${getIndicator(
            value,
          )}`}
        />

        <span className="font-semibold capitalize">
          {value}
        </span>
      </div>
    </div>
  );
}

function getIndicator(value: string): string {
  switch (value) {
    case "high":
      return "bg-gray-900";

    case "medium":
      return "bg-gray-500";

    default:
      return "bg-gray-300";
  }
}
