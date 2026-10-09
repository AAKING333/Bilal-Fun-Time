from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from config import settings
from db.session import get_db
from ai_pipeline import ai_pipeline
from services.rates import rate_service
from schemas import AdminHealthResponse, SafeConfigResponse

router = APIRouter(prefix="/admin", tags=["System Administration"])


@router.get("/health", response_model=AdminHealthResponse)
async def get_system_health(db: AsyncSession = Depends(get_db)):
    """
    Returns AI subsystems and database health status.
    """
    # Check DB connectivity
    db_connected = False
    try:
        await db.execute(text("SELECT 1"))
        db_connected = True
    except Exception:
        db_connected = False

    # Check Ollama
    ollama_ok = ai_pipeline.ollama_available
    if not ollama_ok and ai_pipeline._ollama_client:
        try:
            ai_pipeline._ollama_client.list()
            ollama_ok = True
        except Exception:
            ollama_ok = False

    items = rate_service.get_all_items()

    overall_status = "healthy" if (ai_pipeline.whisper_loaded and db_connected) else "degraded"

    return AdminHealthResponse(
        status=overall_status,
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        whisper_model=settings.WHISPER_MODEL,
        whisper_loaded=ai_pipeline.whisper_loaded,
        ollama_model=settings.OLLAMA_MODEL,
        ollama_reachable=ollama_ok,
        rates_count=len(items),
        database_connected=db_connected
    )


@router.get("/config", response_model=SafeConfigResponse)
def get_safe_config():
    """
    Returns non-sensitive public configuration including official helpline references.
    """
    return SafeConfigResponse(
        app_name=settings.APP_NAME,
        app_version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
        whisper_model=settings.WHISPER_MODEL,
        ollama_model=settings.OLLAMA_MODEL,
        upload_max_bytes=settings.UPLOAD_MAX_BYTES,
        audio_max_duration_seconds=settings.AUDIO_MAX_DURATION_SECONDS,
        district_helpline_ict=settings.DISTRICT_HELPLINE_ICT,
        district_helpline_rawalpindi=settings.DISTRICT_HELPLINE_RAWALPINDI,
        pera_enforcement_helpline=settings.PERA_ENFORCEMENT_HELPLINE,
        pfa_food_safety_helpline=settings.PFA_FOOD_SAFETY_HELPLINE,
        cda_municipal_helpline=settings.CDA_MUNICIPAL_HELPLINE,
        wasa_rawalpindi_helpline=settings.WASA_RAWALPINDI_HELPLINE,
        legal_fine_min_pkr=settings.LEGAL_FINE_MIN_PKR,
        legal_fine_max_pkr=settings.LEGAL_FINE_MAX_PKR
    )


@router.post("/reseed", status_code=status.HTTP_200_OK)
async def trigger_reseed(db: AsyncSession = Depends(get_db)):
    """
    Reseeds realistic Islamabad/Rawalpindi demo grievance data for live hackathon presentations.
    """
    from scripts.seed_demo_data import seed_database
    count = await seed_database(db)
    return {
        "status": "success",
        "message": f"Successfully reseeded {count} demo complaints into the database."
    }

