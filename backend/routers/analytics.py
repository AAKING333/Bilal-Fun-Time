from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import get_db
from services.analytics import AnalyticsService
from schemas import (
    AnalyticsOverview,
    HotspotArea,
    RepeatOffender,
    TrendsResponse
)

router = APIRouter(prefix="/analytics", tags=["Governance Analytics"])


@router.get("/overview", response_model=AnalyticsOverview)
async def get_analytics_overview(db: AsyncSession = Depends(get_db)):
    """
    Returns governance KPIs: total complaints, overpricing cases,
    estimated excess charged to citizens, and top gouged commodities.
    """
    return await AnalyticsService.get_overview(db)


@router.get("/hotspots", response_model=List[HotspotArea])
async def get_hotspots(db: AsyncSession = Depends(get_db)):
    """
    Returns geographic complaint hotspots across Islamabad and Rawalpindi markets
    with coordinates for dashboard mapping.
    """
    return await AnalyticsService.get_hotspots(db)


@router.get("/repeat-offenders", response_model=List[RepeatOffender])
async def get_repeat_offenders(db: AsyncSession = Depends(get_db)):
    """
    Identifies repeat price-gouging shops and vendors for priority enforcement actions.
    """
    return await AnalyticsService.get_repeat_offenders(db)


@router.get("/trends", response_model=TrendsResponse)
async def get_trends(
    days: int = Query(14, ge=1, le=90, description="Number of past days for trend series"),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns daily time-series trends of citizen grievances and inflation rate deviations.
    """
    return await AnalyticsService.get_trends(db, days=days)

