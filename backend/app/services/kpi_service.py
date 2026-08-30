import pandas as pd

from app.data.loader import BusinessDataLoader
from app.models.kpi_models import KPIValue


class KPIService:
    """Calculates high-level business KPI values."""

    SUPPORTED_KPIS = {
        "revenue": "revenue",
        "units_sold": "units_sold",
        "customer_complaints": "customer_complaints",
        "inventory_available": "inventory_available",
        "stockout_rate": "stockout_rate",
        "delivery_delay_rate": "delivery_delay_rate",
    }

    def __init__(self):
        self.loader = BusinessDataLoader()

    def get_data(self) -> pd.DataFrame:
        return self.loader.load()

    def calculate_kpi(
        self,
        kpi: str,
        current_period: str,
        previous_period: str,
    ) -> KPIValue:

        kpi_key = kpi.lower()

        if kpi_key not in self.SUPPORTED_KPIS:
            raise ValueError(
                f"Unsupported KPI: {kpi}. "
                f"Supported KPIs: "
                f"{list(self.SUPPORTED_KPIS.keys())}"
            )

        column = self.SUPPORTED_KPIS[kpi_key]

        df = self.get_data()

        current_date = pd.Timestamp(
            f"{current_period}-01"
        )

        previous_date = pd.Timestamp(
            f"{previous_period}-01"
        )

        current_data = df[
            df["date"] == current_date
        ]

        previous_data = df[
            df["date"] == previous_date
        ]

        if current_data.empty:
            raise ValueError(
                f"No data found for current period: "
                f"{current_period}"
            )

        if previous_data.empty:
            raise ValueError(
                f"No data found for previous period: "
                f"{previous_period}"
            )

        current_value = float(
            current_data[column].sum()
            if column not in {
                "inventory_available",
                "stockout_rate",
                "delivery_delay_rate",
            }
            else current_data[column].mean()
        )

        previous_value = float(
            previous_data[column].sum()
            if column not in {
                "inventory_available",
                "stockout_rate",
                "delivery_delay_rate",
            }
            else previous_data[column].mean()
        )

        if previous_value == 0:
            percentage_change = 0.0
        else:
            percentage_change = (
                (current_value - previous_value)
                / abs(previous_value)
            ) * 100

        return KPIValue(
            name=kpi,
            current_value=round(current_value, 4),
            previous_value=round(previous_value, 4),
            percentage_change=round(
                percentage_change,
                4,
            ),
        )