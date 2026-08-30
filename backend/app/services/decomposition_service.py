import pandas as pd

from app.models.investigation_models import Driver


class DecompositionService:
    """
    Breaks down KPI changes across business dimensions.
    """

    DIMENSIONS = [
        "region",
        "product",
        "channel",
        "customer_segment",
    ]

    def decompose(
        self,
        df: pd.DataFrame,
        kpi_column: str,
        current_period: str,
        previous_period: str,
    ) -> list[Driver]:

        current_date = pd.Timestamp(
            f"{current_period}-01"
        )

        previous_date = pd.Timestamp(
            f"{previous_period}-01"
        )

        current_df = df[
            df["date"] == current_date
        ]

        previous_df = df[
            df["date"] == previous_date
        ]

        if current_df.empty or previous_df.empty:
            return []

        drivers: list[Driver] = []

        for dimension in self.DIMENSIONS:

            current_grouped = (
                current_df
                .groupby(dimension)[kpi_column]
                .sum()
            )

            previous_grouped = (
                previous_df
                .groupby(dimension)[kpi_column]
                .sum()
            )

            comparison = pd.concat(
                [
                    previous_grouped.rename(
                        "previous"
                    ),
                    current_grouped.rename(
                        "current"
                    ),
                ],
                axis=1,
            ).fillna(0)

            comparison["change"] = (
                comparison["current"]
                - comparison["previous"]
            )

            total_absolute_change = (
                comparison["change"]
                .abs()
                .sum()
            )

            if total_absolute_change == 0:
                continue

            comparison["contribution"] = (
                comparison["change"].abs()
                / total_absolute_change
            ) * 100

            for value, row in (
                comparison
                .sort_values(
                    "contribution",
                    ascending=False,
                )
                .head(3)
                .iterrows()
            ):

                direction = (
                    "increase"
                    if row["change"] > 0
                    else "decrease"
                )

                drivers.append(
                    Driver(
                        dimension=dimension,
                        value=str(value),
                        contribution_percentage=round(
                            float(
                                row["contribution"]
                            ),
                            2,
                        ),
                        direction=direction,
                    )
                )

        return sorted(
            drivers,
            key=lambda driver:
                driver.contribution_percentage,
            reverse=True,
        )