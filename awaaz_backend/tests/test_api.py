import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_root_endpoint():
    """Verify root status and metadata."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["app"] == "Awaaz Pakistan"
    assert data["status"] == "online"
    assert "helplines" in data


def test_rates_endpoints():
    """Verify official rates listing, single item, search, and check."""
    # List all
    res = client.get("/api/rates")
    assert res.status_code == 200
    data = res.json()
    assert data["total_items"] >= 25
    assert len(data["items"]) >= 25

    # Filter category
    res_cat = client.get("/api/rates?category=vegetable")
    assert res_cat.status_code == 200
    veg_data = res_cat.json()
    assert all(item["category"] == "vegetable" for item in veg_data["items"])

    # Search item
    res_srch = client.get("/api/rates?search=potato")
    assert res_srch.status_code == 200
    assert len(res_srch.json()["items"]) >= 1

    # Single item
    res_single = client.get("/api/rates/aloo")
    assert res_single.status_code == 200
    assert res_single.json()["id"] == "aloo"
    assert res_single.json()["price"] == 100.0

    # Non-existent item
    res_404 = client.get("/api/rates/non_existent_item_xyz")
    assert res_404.status_code == 404

    # Reload rate list
    res_reload = client.post("/api/rates/reload")
    assert res_reload.status_code == 200
    assert res_reload.json()["status"] == "success"

    # Price check
    res_chk = client.post("/api/rates/check", json={"query": "Aloo 180 rupay"})
    assert res_chk.status_code == 200
    chk_data = res_chk.json()
    assert chk_data["reported_price"] == 180.0
    assert chk_data["official_price"] == 100.0
    assert chk_data["is_overpriced"] is True
    assert chk_data["percentage_overcharge"] == 80.0


def test_complaints_endpoints():
    """Verify complaint creation, listing, detail, and status updates."""
    # Submit text complaint
    payload = {
        "transcript_text": "Raja Bazaar mein doodh 280 rupay litre bech rahe hain.",
        "location_area": "Raja Bazaar, Rawalpindi",
        "shop_name": "Test Milk Shop"
    }
    create_res = client.post("/api/complaints/text", json=payload)
    assert create_res.status_code == 201
    created_comp = create_res.json()
    assert created_comp["id"] is not None
    assert created_comp["category"] == "PERA - Overpricing"
    assert created_comp["reported_price"] == 280.0
    assert created_comp["official_price"] == 210.0
    comp_id = created_comp["id"]

    # Get single complaint
    get_res = client.get(f"/api/complaints/{comp_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == comp_id

    # List complaints
    list_res = client.get("/api/complaints?limit=10")
    assert list_res.status_code == 200
    list_data = list_res.json()
    assert list_data["total"] >= 1
    assert len(list_data["items"]) >= 1

    # Filter complaints
    filter_res = client.get("/api/complaints?category=PERA%20-%20Overpricing")
    assert filter_res.status_code == 200
    assert all(c["category"] == "PERA - Overpricing" for c in filter_res.json()["items"])

    # Update complaint status
    update_res = client.patch(
        f"/api/complaints/{comp_id}",
        json={"status": "Investigating", "admin_notes": "Assigned to Price Magistrate Rawalpindi"}
    )
    assert update_res.status_code == 200
    assert update_res.json()["status"] == "Investigating"
    assert update_res.json()["admin_notes"] == "Assigned to Price Magistrate Rawalpindi"


def test_analytics_endpoints():
    """Verify overview, hotspots, repeat offenders, and trends."""
    res_ov = client.get("/api/analytics/overview")
    assert res_ov.status_code == 200
    ov_data = res_ov.json()
    assert "total_complaints" in ov_data
    assert "overpricing_cases" in ov_data
    assert "most_gouged_items" in ov_data

    res_hot = client.get("/api/analytics/hotspots")
    assert res_hot.status_code == 200
    assert isinstance(res_hot.json(), list)

    res_rep = client.get("/api/analytics/repeat-offenders")
    assert res_rep.status_code == 200
    assert isinstance(res_rep.json(), list)

    res_tr = client.get("/api/analytics/trends?days=7")
    assert res_tr.status_code == 200
    tr_data = res_tr.json()
    assert "trends" in tr_data
    assert len(tr_data["trends"]) >= 7


def test_admin_endpoints():
    """Verify health and safe config endpoints."""
    res_health = client.get("/api/admin/health")
    assert res_health.status_code == 200
    health_data = res_health.json()
    assert health_data["database_connected"] is True
    assert health_data["rates_count"] >= 25

    res_cfg = client.get("/api/admin/config")
    assert res_cfg.status_code == 200
    cfg_data = res_cfg.json()
    assert "051" in cfg_data["district_helpline_ict"]
    assert cfg_data["pera_enforcement_helpline"] == "1717"

