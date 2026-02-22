from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import BundlePolicy
from app.schemas import BundlePolicyOut

router = APIRouter(prefix="/api/policies", tags=["policies"])


@router.get("", response_model=list[BundlePolicyOut])
async def list_policies(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BundlePolicy).order_by(BundlePolicy.id))
    return result.scalars().all()
