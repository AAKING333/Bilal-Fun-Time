import os
import shutil
import tempfile
import logging
from typing import Optional, List
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, or_

from db.session import get_db
from db.models import Complaint
from schemas import (
    ComplaintResponse,
    ComplaintListResponse,
    TextComplaintRequest,
    ComplaintUpdateStatusRequest
)
from services.audio import validate_and_convert_audio
from services.nlp_rules import extract_price_and_normalize
from ai_pipeline import ai_pipeline

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/complaints", tags=["Citizen Complaints"])

# Known Islamabad / Rawalpindi localities to extract if not explicitly provided
NOTABLE_AREAS = [
    "G-9 Markaz", "Karachi Company", "Raja Bazaar", "Commercial Market",
    "Aabpara", "F-10 Markaz", "F-6 Super Market", "I-10 Sabzi Mandi",
    "Saddar", "Tench Bhata", "PWD Islamabad", "Barakahu", "Satellite Town"
]


def extract_area_from_text(text: str) -> Optional[str]:
    lowered = text.lower()
    for area in NOTABLE_AREAS:
        if area.lower() in lowered:
            return area
    return None


@router.post("/voice", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
async def submit_voice_complaint(
    audio: UploadFile = File(..., description="Audio file (m4a, mp3, wav, webm, ogg, aac)"),
    location_area: Optional[str] = Form(None, description="E.g. 'G-9 Markaz, Islamabad' or 'Raja Bazaar'"),
    shop_name: Optional[str] = Form(None, description="Shop or vendor name"),
    lat: Optional[float] = Form(None),
    lng: Optional[float] = Form(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Submits a voice note complaint in Urdu, Roman Urdu, Punjabi, Pashto, or English.
    Converts audio via FFmpeg, transcribes with Whisper, extracts structured intelligence
    with Ollama 1.5B / deterministic rules, and routes to the appropriate authority.
    """
    # Create temp directory for file processing
    temp_dir = tempfile.mkdtemp(prefix="awaaz_audio_")
    raw_path = os.path.join(temp_dir, f"input_{audio.filename or 'audio.wav'}")
    wav_path = os.path.join(temp_dir, "processed_16k.wav")

    try:
        # Save uploaded file
        with open(raw_path, "wb") as f:
            shutil.copyfileobj(audio.file, f)

        # Validate and convert audio to 16kHz mono WAV
        is_valid, duration_sec, msg = validate_and_convert_audio(raw_path, wav_path)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Audio validation failed: {msg}"
            )

        # Transcribe with Whisper
        transcription_res = ai_pipeline.transcribe_audio_detailed(wav_path)
        transcript_text = transcription_res.get("text", "").strip()

        if not transcript_text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No audible speech detected. The audio file was silent or contained unrecognised background noise."
            )

        # Parse complaint with hybrid AI pipeline
        extracted = ai_pipeline.parse_complaint_text(transcript_text)

        # Resolve location if not provided
        inferred_area = location_area or extract_area_from_text(transcript_text)

        # Create Complaint record
        complaint = Complaint(
            audio_filename=audio.filename,
            audio_duration_seconds=duration_sec,
            transcript_raw=transcript_text,
            detected_language=extracted["detected_language"],
            category=extracted["category"],
            urgency=extracted["urgency"],
            status="Pending",
            extraction_confidence=extracted["extraction_confidence"],
            needs_review=extracted["needs_review"],
            item_name=extracted.get("item_name"),
            item_canonical_id=extracted.get("item_canonical_id"),
            unit=extracted.get("unit"),
            reported_price=extracted.get("reported_price"),
            official_price=extracted.get("official_price"),
            price_difference_pkr=extracted.get("price_difference_pkr"),
            percentage_overcharge=extracted.get("percentage_overcharge"),
            native_response=extracted["native_response"],
            routing_agency=extracted["routing_agency"],
            helpline_reference=extracted["helpline_reference"],
            location_area=inferred_area,
            shop_name=shop_name,
            lat=lat,
            lng=lng
        )

        db.add(complaint)
        await db.commit()
        await db.refresh(complaint)

        return ComplaintResponse.model_validate(complaint)

    finally:
        # Clean up temporary audio files
        shutil.rmtree(temp_dir, ignore_errors=True)


@router.post("/text", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
async def submit_text_complaint(
    request: TextComplaintRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Submits a text-based complaint in Urdu (Urdu script), Roman Urdu, Punjabi, Pashto, or English.
    """
    text = request.transcript_text.strip()
    if not text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Complaint text cannot be empty"
        )

    extracted = ai_pipeline.parse_complaint_text(text)
    inferred_area = request.location_area or extract_area_from_text(text)

    complaint = Complaint(
        audio_filename=None,
        audio_duration_seconds=None,
        transcript_raw=text,
        detected_language=extracted["detected_language"],
        category=extracted["category"],
        urgency=extracted["urgency"],
        status="Pending",
        extraction_confidence=extracted["extraction_confidence"],
        needs_review=extracted["needs_review"],
        item_name=extracted.get("item_name"),
        item_canonical_id=extracted.get("item_canonical_id"),
        unit=extracted.get("unit"),
        reported_price=extracted.get("reported_price"),
        official_price=extracted.get("official_price"),
        price_difference_pkr=extracted.get("price_difference_pkr"),
        percentage_overcharge=extracted.get("percentage_overcharge"),
        native_response=extracted["native_response"],
        routing_agency=extracted["routing_agency"],
        helpline_reference=extracted["helpline_reference"],
        location_area=inferred_area,
        shop_name=request.shop_name,
        lat=request.lat,
        lng=request.lng
    )

    db.add(complaint)
    await db.commit()
    await db.refresh(complaint)

    return ComplaintResponse.model_validate(complaint)


@router.get("", response_model=ComplaintListResponse)
async def list_complaints(
    category: Optional[str] = Query(None, description="Filter by category"),
    urgency: Optional[str] = Query(None, description="Filter by urgency: Low, Medium, High"),
    status: Optional[str] = Query(None, description="Filter by status: Pending, Investigating, Resolved, Rejected"),
    needs_review: Optional[bool] = Query(None, description="Filter complaints requiring human review"),
    location_area: Optional[str] = Query(None, description="Filter by location area"),
    search: Optional[str] = Query(None, description="Search transcript, item, or shop"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Lists complaints with comprehensive filtering, search, and pagination."""
    query = select(Complaint)

    if category:
        query = query.where(Complaint.category == category)
    if urgency:
        query = query.where(Complaint.urgency == urgency)
    if status:
        query = query.where(Complaint.status == status)
    if needs_review is not None:
        query = query.where(Complaint.needs_review == needs_review)
    if location_area:
        query = query.where(Complaint.location_area.ilike(f"%{location_area}%"))
    if search:
        search_filter = or_(
            Complaint.transcript_raw.ilike(f"%{search}%"),
            Complaint.item_name.ilike(f"%{search}%"),
            Complaint.shop_name.ilike(f"%{search}%")
        )
        query = query.where(search_filter)

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    count_res = await db.execute(count_query)
    total = count_res.scalar() or 0

    # Paginate and order by newest first
    query = query.order_by(desc(Complaint.created_at)).offset((page - 1) * limit).limit(limit)
    res = await db.execute(query)
    items = res.scalars().all()

    return ComplaintListResponse(
        total=total,
        items=[ComplaintResponse.model_validate(i) for i in items],
        page=page,
        limit=limit
    )


@router.get("/{complaint_id}", response_model=ComplaintResponse)
async def get_complaint(complaint_id: str, db: AsyncSession = Depends(get_db)):
    """Fetches full details of a specific complaint."""
    res = await db.execute(select(Complaint).where(Complaint.id == complaint_id))
    complaint = res.scalar_one_or_none()
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint with ID '{complaint_id}' not found"
        )
    return ComplaintResponse.model_validate(complaint)


@router.patch("/{complaint_id}", response_model=ComplaintResponse)
async def update_complaint_status(
    complaint_id: str,
    update: ComplaintUpdateStatusRequest,
    db: AsyncSession = Depends(get_db)
):
    """Updates the administrative resolution status and notes of a complaint."""
    res = await db.execute(select(Complaint).where(Complaint.id == complaint_id))
    complaint = res.scalar_one_or_none()
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint with ID '{complaint_id}' not found"
        )

    valid_statuses = ["Pending", "Investigating", "Resolved", "Rejected"]
    if update.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )

    complaint.status = update.status
    if update.admin_notes is not None:
        complaint.admin_notes = update.admin_notes

    # If resolved or rejected, clear review flag
    if update.status in ["Resolved", "Rejected"]:
        complaint.needs_review = False

    await db.commit()
    await db.refresh(complaint)
    return ComplaintResponse.model_validate(complaint)

