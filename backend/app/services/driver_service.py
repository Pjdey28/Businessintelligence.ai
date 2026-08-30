import pandas as pd


class DriverService:
    """
    Identifies candidate operational drivers associated
    with KPI movements.
    """

    DRIVER_COLUMNS = [
        "inventory_available",
        "stockout_rate",
        "delivery_delay_rate",
        "customer_complaints",
        "units_sold",
        "unit_price",
    ]

    def analyze(
        self,
        df: pd.DataFrame,
        kpi_column: str,
    ) -> list[dict]:

        available_columns = [
                    column
                    for column in self.DRIVER_COLUMNS
                    if column in df.columns and column != kpi_column
                ]

        if not available_columns:
            return []

        correlation_df = df[
            [kpi_column] + available_columns
        ].copy()

        correlation_matrix = (
            correlation_df
            .corr(numeric_only=True)
        )

        results = []

        for column in available_columns:

            if column == kpi_column:
                continue

            correlation = correlation_matrix.loc[
                column,
                kpi_column,
            ]

            if pd.isna(correlation):
                continue

            if correlation > 0:
                relationship = "positive"
            elif correlation < 0:
                relationship = "negative"
            else:
                relationship = "neutral"

            results.append(
                {
                    "driver": column,
                    "correlation": round(
                        float(correlation),
                        4,
                    ),
                    "relationship": relationship,
                }
            )

        return sorted(
            results,
            key=lambda item:
                abs(item["correlation"]),
            reverse=True,
        )