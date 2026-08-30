import type {
  InvestigationResponse,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export interface InvestigationRequest {
  kpi: string;
  period: string;
}

export async function investigateKPI(
  request: InvestigationRequest,
): Promise<InvestigationResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/investigate`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    const error = await response.json()
      .catch(() => null);

    throw new Error(
      error?.detail ||
        "Unable to investigate KPI.",
    );
  }

  return response.json();
}