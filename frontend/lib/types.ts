export interface KPIResult {
  name: string;
  current_value: number;
  previous_value: number;
  percentage_change: number;
}

export interface AnomalyResult {
  is_anomaly: boolean;
  anomaly_score: number;
  baseline_value: number;
  deviation_percentage: number;
}

export interface Driver {
  dimension: string;
  value: string;
  contribution_percentage: number;
  direction: "increase" | "decrease";
}

export interface OperationalDriver {
  driver: string;
  correlation: number;
  relationship: "positive" | "negative" | "neutral";
}

export interface Evidence {
  source: string;
  evidence_type: string;
  content: string;
  relevance_score: number;
}

export interface RootCause {
  cause: string;
  explanation: string;
  supporting_evidence: string[];
  confidence: "high" | "medium" | "low";
}

export interface Recommendation {
  action: string;
  rationale: string;
  priority: "high" | "medium" | "low";
}

export interface TrendPoint {
  period: string;
  value: number;
}

export interface Investigation {
  kpi: KPIResult;
  anomaly: AnomalyResult;

  trend: TrendPoint[];

  drivers: Driver[];

  operational_drivers: OperationalDriver[];

  evidence: Evidence[];

  evidence_strength: "high" | "medium" | "low";

  executive_summary: string;

  root_causes: RootCause[];

  recommendations: Recommendation[];

  confidence: "high" | "medium" | "low";

  ambiguity: string | null;
}

export interface InvestigationResponse {
  status: string;
  investigation: Investigation;
}