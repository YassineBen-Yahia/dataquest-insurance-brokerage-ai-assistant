"""Seed the database with initial data."""

import asyncio
from sqlalchemy import select
from app.database import engine, Base, async_session
from app.models import BundlePolicy

POLICIES = [
    (0, "Auto_Comprehensive",   "Full vehicle coverage including collision, liability, theft, fire, and natural disaster protection."),
    (1, "Auto_Liability_Basic",  "Basic liability coverage for drivers, covering third-party bodily injury and property damage as required by law."),
    (2, "Basic_Health",          "Essential health insurance covering primary care, emergency services, and preventive care for individuals."),
    (3, "Family_Comprehensive",  "All-inclusive family bundle combining health, home, and life insurance for complete household protection."),
    (4, "Health_Dental_Vision",  "Extended health plan bundling medical, dental, and vision care into a single comprehensive policy."),
    (5, "Home_Premium",          "Premium homeowner's insurance covering structure, contents, and liability with extensive natural disaster protection."),
    (6, "Home_Standard",         "Standard homeowner's insurance providing dwelling, personal property, and personal liability coverage."),
    (7, "Premium_Health_Life",   "Top-tier package combining premium health insurance with life insurance for long-term financial security."),
    (8, "Renter_Basic",          "Basic renters insurance covering personal belongings against theft and damage, plus personal liability."),
    (9, "Renter_Premium",        "Enhanced renters insurance with higher coverage limits, additional riders, and identity theft protection."),
]


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        existing = (await session.execute(select(BundlePolicy))).scalars().first()
        if existing:
            print("Bundle policies already seeded – skipping.")
            return

        for pid, name, desc in POLICIES:
            session.add(BundlePolicy(id=pid, bundle_name=name, description=desc))

        await session.commit()
        print(f"Seeded {len(POLICIES)} bundle policies.")


if __name__ == "__main__":
    asyncio.run(seed())
