from pathlib import Path

import numpy as np
import pandas as pd


SEED = 42

REGIONS = [
    "North",
    "South",
    "East",
    "West",
]

PRODUCTS = [
    "Product A",
    "Product B",
    "Product C",
    "Product D",
]

CHANNELS = [
    "Retail",
    "Distributor",
]

CUSTOMER_SEGMENTS = [
    "Enterprise",
    "SMB",
]

MONTHS = pd.date_range(
    "2025-01-01",
    "2025-08-01",
    freq="MS",
)


def generate_dataset() -> pd.DataFrame:

    rng = np.random.default_rng(SEED)

    rows = []

    for date in MONTHS:

        month_number = date.month

        for region in REGIONS:
            for product in PRODUCTS:
                for channel in CHANNELS:
                    for segment in CUSTOMER_SEGMENTS:

                        base_units = {
                            "Product A": 120,
                            "Product B": 105,
                            "Product C": 90,
                            "Product D": 110,
                        }[product]

                        region_factor = {
                            "North": 1.10,
                            "South": 0.95,
                            "East": 1.05,
                            "West": 1.00,
                        }[region]

                        channel_factor = {
                            "Retail": 1.00,
                            "Distributor": 1.15,
                        }[channel]

                        segment_factor = {
                            "Enterprise": 1.20,
                            "SMB": 0.80,
                        }[segment]

                        seasonal_factor = (
                            1
                            + 0.02
                            * np.sin(
                                month_number
                            )
                        )

                        units_sold = (
                            base_units
                            * region_factor
                            * channel_factor
                            * segment_factor
                            * seasonal_factor
                            + rng.normal(
                                0,
                                5,
                            )
                        )

                        unit_price = {
                            "Product A": 100,
                            "Product B": 120,
                            "Product C": 140,
                            "Product D": 110,
                        }[product]

                        unit_price *= (
                            1
                            + rng.normal(
                                0,
                                0.015,
                            )
                        )

                        inventory_available = (
                            0.93
                            + rng.normal(
                                0,
                                0.015,
                            )
                        )

                        stockout_rate = (
                            0.025
                            + rng.normal(
                                0,
                                0.005,
                            )
                        )

                        delivery_delay_rate = (
                            0.04
                            + rng.normal(
                                0,
                                0.008,
                            )
                        )

                        complaints = (
                            units_sold
                            * 0.012
                            + rng.normal(
                                0,
                                0.5,
                            )
                        )

                        # -------------------------------------------------
                        # Deliberate August business event
                        # -------------------------------------------------

                        if (
                            date.month == 8
                            and region == "East"
                            and product == "Product D"
                        ):

                            inventory_available = (
                                0.62
                                + rng.normal(
                                    0,
                                    0.015,
                                )
                            )

                            stockout_rate = (
                                0.19
                                + rng.normal(
                                    0,
                                    0.01,
                                )
                            )

                            delivery_delay_rate = (
                                0.17
                                + rng.normal(
                                    0,
                                    0.01,
                                )
                            )

                            units_sold *= 0.72

                            complaints *= 2.8

                        # Secondary operational impact
                        if (
                            date.month == 8
                            and region == "East"
                            and product == "Product D"
                            and channel == "Distributor"
                        ):
                            delivery_delay_rate += 0.05
                            complaints *= 1.15

                        units_sold = max(
                            units_sold,
                            0,
                        )

                        revenue = (
                            units_sold
                            * unit_price
                        )

                        rows.append(
                            {
                                "date": date,
                                "region": region,
                                "product": product,
                                "channel": channel,
                                "customer_segment":
                                    segment,
                                "revenue":
                                    round(
                                        revenue,
                                        2,
                                    ),
                                "inventory_available":
                                    round(
                                        inventory_available,
                                        4,
                                    ),
                                "stockout_rate":
                                    round(
                                        max(
                                            stockout_rate,
                                            0,
                                        ),
                                        4,
                                    ),
                                "delivery_delay_rate":
                                    round(
                                        max(
                                            delivery_delay_rate,
                                            0,
                                        ),
                                        4,
                                    ),
                                "customer_complaints":
                                    round(
                                        max(
                                            complaints,
                                            0,
                                        ),
                                        2,
                                    ),
                                "units_sold":
                                    round(
                                        units_sold,
                                        2,
                                    ),
                                "unit_price":
                                    round(
                                        unit_price,
                                        2,
                                    ),
                            }
                        )

    return pd.DataFrame(rows)


def main():

    output_path = (
        Path(__file__).resolve().parent
        / "business_data_synthetic.csv"
    )

    df = generate_dataset()

    df.to_csv(
        output_path,
        index=False,
    )

    print(
        f"Generated {len(df)} rows."
    )

    print(
        f"Saved dataset to: {output_path}"
    )


if __name__ == "__main__":
    main()