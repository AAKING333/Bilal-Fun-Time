import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from config import settings
from db.session import init_db
from ai_pipeline import ai_pipeline
from services.rates import rate_service
from routers import complaints, rates, analytics, admin

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("awaaz_pakistan")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Runs database initialization and initializes AI pipeline (Whisper + Ollama).
    """
    logger.info("Initializing Awaaz Pakistan database...")
    await init_db()

    logger.info("Verifying official rate list database...")
    rate_service.load()

    logger.info("Initializing AI Pipeline (Whisper & Ollama)...")
    ai_pipeline.initialize()

    logger.info("Awaaz Pakistan backend is ready to serve citizens.")
    yield
    logger.info("Awaaz Pakistan backend shutting down.")


def create_app() -> FastAPI:
    """FastAPI Application Factory."""
    app = FastAPI(
        title="Awaaz Pakistan - Voice Governance API",
        description=(
            "AI-powered voice governance and price-gouging reporting platform for Pakistani citizens. "
            "Supports multilingual voice notes in Urdu, Roman Urdu, Punjabi, Pashto, and English, "
            "transcribed locally with Whisper and parsed with Ollama qwen2.5:1.5b-instruct."
        ),
        version=settings.APP_VERSION,
        lifespan=lifespan
    )

    # CORS configuration - Allow all origins for hackathon frontend integration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount routers under API prefix
    app.include_router(complaints.router, prefix=settings.API_PREFIX)
    app.include_router(rates.router, prefix=settings.API_PREFIX)
    app.include_router(analytics.router, prefix=settings.API_PREFIX)
    app.include_router(admin.router, prefix=settings.API_PREFIX)

    # Exception Handlers
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        logger.warning(f"Validation error on {request.url.path}: {exc.errors()}")
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "error": "Validation Error",
                "details": exc.errors()
            }
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.exception(f"Unhandled exception on {request.url.path}: {exc}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "Internal Server Error",
                "message": "An unexpected error occurred. Please try again or contact administration."
            }
        )

    @app.get("/", tags=["Root"])
    def root():
        return {
            "app": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "region": "Islamabad / Rawalpindi (ICT & Punjab)",
            "status": "online",
            "docs_url": "/docs",
            "helplines": {
                "ICT_Admin": f"{settings.DISTRICT_HELPLINE_ICT} (Placeholder)",
                "Rawalpindi_DC": f"{settings.DISTRICT_HELPLINE_RAWALPINDI} (Placeholder)",
                "PERA_Price_Enforcement": f"{settings.PERA_ENFORCEMENT_HELPLINE} (Placeholder)",
                "PFA_Food_Safety": f"{settings.PFA_FOOD_SAFETY_HELPLINE} (Placeholder)",
                "CDA_Municipal": f"{settings.CDA_MUNICIPAL_HELPLINE} (Placeholder)"
            }
        }

    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

