import numpy as np
import pandas as pd

from app.models.kpi_models import KPIAnomaly


class AnomalyService:
    """
    Detects whether a KPI movement is unusual relative to
    its historical behavior.
    """

    def __init__(
        self,
        z_score_threshold: float = 2.0,
        percentage_threshold: float = 5.0,
    ):
        self.z_score_threshold = z_score_threshold
        self.percentage_threshold = percentage_threshold

    def detect(
        self,
        df: pd.DataFrame,
        kpi_column: str,
        current_period: str,
    ) -> KPIAnomaly:

        monthly = (
            df.groupby("date")[kpi_column]
            .sum()
            .sort_index()
        )

        current_date = pd.Timestamp(
            f"{current_period}-01"
        )

        if current_date not in monthly.index:
            raise ValueError(
                f"No KPI data found for {current_period}"
            )

        current_value = float(
            monthly.loc[current_date]
        )

        historical = monthly[
            monthly.index < current_date
        ]

        if len(historical) < 2:
            return KPIAnomaly(
                is_anomaly=False,
                anomaly_score=0.0,
                baseline_value=float(
                    historical.mean()
                    if len(historical)
                    else current_value
                ),
                deviation_percentage=0.0,
            )

        baseline = float(
            historical.mean()
        )

        standard_deviation = float(
            historical.std(ddof=1)
        )

        if standard_deviation == 0:
            z_score = 0.0
        else:
            z_score = (
                current_value - baseline
            ) / standard_deviation

        deviation_percentage = (
            (current_value - baseline)
            / abs(baseline)
        ) * 100 if baseline != 0 else 0.0

        is_anomaly = (
            abs(z_score) >= self.z_score_threshold
            or abs(deviation_percentage)
            >= self.percentage_threshold
        )

        return KPIAnomaly(
            is_anomaly=is_anomaly,
            anomaly_score=round(
                abs(z_score),
                4,
            ),
            baseline_value=round(
                baseline,
                4,
            ),
            deviation_percentage=round(
                deviation_percentage,
                4,
            ),
        )