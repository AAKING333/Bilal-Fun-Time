from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException, status
from services.rates import rate_service
from services.nlp_rules import extract_price_and_normalize
from schemas import RateListResponse, RateItem, PriceCheckRequest, PriceComparisonResult

router = APIRouter(prefix="/rates", tags=["Official Notified Rates"])


@router.get("", response_model=RateListResponse)
def get_rate_list(
    category: Optional[str] = Query(None, description="Filter by category (vegetable, grocery, meat, poultry, dairy, bakery, pulses, fruit)"),
    search: Optional[str] = Query(None, description="Search item name or alias in English or Urdu")
):
    """
    Returns official district administration notified rates for Islamabad/Rawalpindi.
    """
    items_dict = rate_service.get_all_items()
    meta = rate_service.get_meta()

    items_list: List[RateItem] = []
    for item_id, data in items_dict.items():
        # Category filter
        if category and data.get("category", "").lower() != category.lower():
            continue

        # Search filter
        if search:
            q = search.lower().strip()
            aliases = [a.lower() for a in data.get("aliases", [])]
            name_en = data.get("name_en", "").lower()
            name_ur = data.get("name_ur", "")
            if (q not in item_id.lower() and
                q not in name_en and
                q not in name_ur and
                not any(q in a for a in aliases)):
                continue

        items_list.append(
            RateItem(
                id=item_id,
                name_en=data.get("name_en", item_id.capitalize()),
                name_ur=data.get("name_ur", ""),
                price=float(data.get("price", 0.0)),
                unit=data.get("unit", "kg"),
                category=data.get("category", "general"),
                aliases=data.get("aliases", [])
            )
        )

    return RateListResponse(
        meta=meta,
        items=items_list,
        total_items=len(items_list)
    )


@router.get("/{item_id}", response_model=RateItem)
def get_single_rate(item_id: str):
    """Returns official rate details for a specific commodity."""
    item = rate_service.get_item(item_id)
    if not item:
        # Try resolving via alias
        res = rate_service.resolve_item(item_id)
        if res:
            canonical_id, item, _ = res
            item_id = canonical_id
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Commodity '{item_id}' not found in official rate list"
            )

    return RateItem(
        id=item_id,
        name_en=item.get("name_en", item_id.capitalize()),
        name_ur=item.get("name_ur", ""),
        price=float(item.get("price", 0.0)),
        unit=item.get("unit", "kg"),
        category=item.get("category", "general"),
        aliases=item.get("aliases", [])
    )


@router.post("/reload", response_model=dict)
def reload_rate_list():
    """Reloads rate-list.json dynamically from disk without restarting."""
    success = rate_service.reload()
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reload rate-list.json"
        )
    meta = rate_service.get_meta()
    items = rate_service.get_all_items()
    return {
        "status": "success",
        "message": f"Successfully reloaded {len(items)} commodities from official rate list",
        "version": meta.get("version", 1),
        "effective_date": meta.get("effective_date", "")
    }


@router.post("/check", response_model=PriceComparisonResult)
def check_price(request: PriceCheckRequest):
    """
    Checks if a reported price violates official notified ceilings.
    Accepts natural language query (e.g. 'Aloo 180') or explicit item and price.
    """
    canonical_id = None
    rep_price = request.reported_price
    unit = request.unit

    if request.query:
        # Extract price using NLP rules
        parsed_price, _ = extract_price_and_normalize(request.query)
        if parsed_price is not None:
            rep_price = parsed_price

        # Extract item
        res = rate_service.resolve_item(request.query)
        if res:
            canonical_id, item_data, _ = res
            if not unit:
                unit = item_data.get("unit", "kg")

    if not canonical_id and request.item_name:
        res = rate_service.resolve_item(request.item_name)
        if res:
            canonical_id, item_data, _ = res
            if not unit:
                unit = item_data.get("unit", "kg")
        else:
            canonical_id = request.item_name

    if rep_price is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not detect reported price from query. Please provide reported_price."
        )

    comparison = rate_service.compare_price(
        item_id=canonical_id or (request.item_name or "unknown"),
        reported_price=rep_price,
        unit=unit
    )

    return PriceComparisonResult(**comparison)

