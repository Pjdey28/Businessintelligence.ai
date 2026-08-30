from pathlib import Path

import pandas as pd

from app.core.config import settings


class BusinessDataLoader:
    """Loads and validates the structured business dataset."""

    REQUIRED_COLUMNS = {
        "date",
        "region",
        "product",
        "channel",
        "customer_segment",
        "units_sold",
        "unit_price",
        "revenue",
        "inventory_available",
        "stockout_rate",
        "delivery_delay_rate",
        "customer_complaints",
    }

    def __init__(self, data_path: str | None = None):
        self.data_path = Path(data_path or settings.data_path)

    def load(self) -> pd.DataFrame:
        if not self.data_path.exists():
            raise FileNotFoundError(
                f"Business dataset not found: {self.data_path}"
            )

        df = pd.read_csv(self.data_path)

        missing_columns = self.REQUIRED_COLUMNS - set(df.columns)

        if missing_columns:
            raise ValueError(
                f"Dataset is missing required columns: "
                f"{sorted(missing_columns)}"
            )

        df["date"] = pd.to_datetime(df["date"])

        numeric_columns = [
            "units_sold",
            "unit_price",
            "revenue",
            "inventory_available",
            "stockout_rate",
            "delivery_delay_rate",
            "customer_complaints",
        ]

        for column in numeric_columns:
            df[column] = pd.to_numeric(
                df[column],
                errors="coerce",
            )

        df = df.dropna(
            subset=numeric_columns
        ).sort_values("date")

        return df.reset_index(drop=True)