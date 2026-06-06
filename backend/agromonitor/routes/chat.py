from ninja import Router
from ..schemas.chat import ChatRequest, ChatResponse

router = Router(tags=["AI Assistant Command Center"])


@router.post("/ask", response=ChatResponse)
def ask_ai_assistant(request, data: ChatRequest):
    """
    Answers geospatial and agronomic questions utilising a simulated RAG vector store.

    Frontend payload (from agromonitorApi.js):
      message:  free-text question
      scenario: optional quick-select scenario name

    Response:
      response: contextual AI reply
      sources:  list of data sources cited
    """
    msg      = data.message.lower()
    scenario = (data.scenario or "").strip()

    # ── 1. Climate-Smart Agriculture ──────────────────────────────────────────
    if scenario == "Climate-Smart Agriculture" or any(
        kw in msg for kw in ("climate", "irrigation", "vpd", "rainfall", "soil temp", "evapotranspiration")
    ):
        reply = (
            "Based on current microclimate sensor logs across your 3 registered plots, "
            "Soil Temperature ranges from 23.2 °C (South Slope) to 26.8 °C (East Ridge). "
            "Land Surface Temperature (LST) peaks at 31.2 °C on East Ridge, generating a "
            "Vapor Pressure Deficit (VPD) of ~2.31 kPa — above the 2.0 kPa critical stress threshold. "
            "Cumulative rainfall this period is lowest on South Slope Plot (8.0 mm) and highest on "
            "East Ridge (19.5 mm). "
            "Recommendations: Schedule micro-sprinkler irrigation during low-evaporative windows "
            "(early morning or late evening) for East Ridge and South Slope plots. "
            "Consider leguminous cover crops to improve soil moisture retention long-term."
        )
        sources = [
            "CHIRPS Precipitation Grids Q2-2026",
            "FAO Irrigation & Drainage Paper No. 56",
            "Farmintelytics Telemetry Probes (PLOT-ALPHA, PLOT-BETA, PLOT-GAMMA)"
        ]

    # ── 2. Land Restoration ───────────────────────────────────────────────────
    elif scenario == "Land Restoration" or any(
        kw in msg for kw in ("restoration", "canopy", "tree", "reforestation", "zone", "biodiversity")
    ):
        reply = (
            "Auditing your 3 active restoration zones:\n"
            "• Canopy Reforestation (ZONE-ALPHA): 88% progression, 94% sapling survival rate (1,200 trees), "
            "45.2 tCO2e carbon offset. Biodiversity score: 92%. Status: Optimal Growth.\n"
            "• Agroforestry Zone (ZONE-BETA): 74% progression, 89% survival (980 trees), "
            "32.8 tCO2e offset. Biodiversity: 88%. Status: Active Care.\n"
            "• Riparian Buffer Zone (ZONE-GAMMA): 62% progression, 81% survival (1,550 trees), "
            "21.5 tCO2e offset. Biodiversity: 81%. Status: Initial Phase.\n"
            "Total carbon sequestered across all restoration zones: 99.5 tCO2e. "
            "Recommendation: Increase native species diversity in ZONE-GAMMA to improve biodiversity score "
            "and soil stabilization against erosion risk."
        )
        sources = [
            "VCS Forest Regrowth Protocol VM0047",
            "AgroMonitor Canopy Progress Ledger",
            "Sentinel-2 Multi-Temporal Classification Layer"
        ]

    # ── 3. Carbon Registry ────────────────────────────────────────────────────
    elif scenario == "Carbon Registry" or any(
        kw in msg for kw in ("carbon", "credit", "mrv", "sequestration", "tco2e", "blockchain", "certificate")
    ):
        reply = (
            "The estate's average carbon density stands at 58.2 tCO2e/HA across 35.7 HA total area. "
            "Restoration zone carbon offsets total 99.5 tCO2e (45.2 + 32.8 + 21.5). "
            "MRV certificates are generated with SHA-256 cryptographic hashes and registered "
            "immutably on the Polygon (EVM) mainnet blockchain via smart contract "
            "0xcAb26388C83818e9508C61D4C6975a5078a9c803. "
            "These cryptographic proofs comply with Gold Standard and Verified Carbon Standard (VCS) "
            "carbon credit verification requirements. Use the Reports tab to generate and download "
            "your latest MRV certificate for any plot or whole-farm scope."
        )
        sources = [
            "IPCC Greenhouse Gas Inventory Guidelines",
            "Polygon Mainnet MRV Ledger Smart Contract",
            "Gold Standard Land Use & Forestry Registry"
        ]

    # ── 4. EUDR Traceability ──────────────────────────────────────────────────
    elif scenario == "Traceability" or any(
        kw in msg for kw in ("trace", "eudr", "deforest", "compliance", "regulation", "supply chain")
    ):
        reply = (
            "EU Deforestation Regulation (EUDR) compliance requires zero forest-to-agricultural "
            "land conversion since the cutoff date of December 31, 2020.\n\n"
            "Audit results:\n"
            "• West Valley Plot (PLOT-ALPHA): ✅ COMPLIANT — 0.8% canopy loss (below 1% threshold). "
            "Baseline 42.5% → Current 41.7%.\n"
            "• East Ridge Plot (PLOT-BETA): ✅ COMPLIANT — 0.2% canopy loss. "
            "Baseline 30.1% → Current 29.9%.\n"
            "• South Slope Plot (PLOT-GAMMA): ⚠️ NON-COMPLIANT — 14.5% canopy loss detected. "
            "Baseline 78.0% → Current 63.5%. Immediate remediation required.\n\n"
            "Export the official traceability certificate from the Reports tab to download "
            "the PostGIS boundary shapes and compliance audit for EU market submission."
        )
        sources = [
            "EU Deforestation Regulation (EUDR) Guidance Document",
            "Sentinel-2 Red-Edge Forest Canopy Index",
            "Farmintelytics PostGIS Boundary Overlap Checker"
        ]

    # ── 5. Default / Greeting ─────────────────────────────────────────────────
    else:
        reply = (
            "Hello! I am your Farmintelytics Spatial AI Assistant — powered by a RAG vector store "
            "indexed against your estate's satellite, sensor, and compliance data.\n\n"
            "I have real-time access to:\n"
            "• Copernicus Sentinel-2 indices: NDVI, NDMI, EVI, RECI, LSWI\n"
            "• Microclimate sensors: Rainfall, Soil Temp, LST, VPD\n"
            "• EUDR deforestation compliance audits (3 plots)\n"
            "• Land restoration zone progress (3 zones, 99.5 tCO2e total)\n"
            "• Blockchain MRV carbon certificates (Polygon mainnet)\n\n"
            "Select one of the quick-scenario buttons above, or ask me a specific question about "
            "your plots, indices, moisture, pest risk, or compliance status."
        )
        sources = [
            "Farmintelytics Spatial Help Center",
            "Sentinel-2 Multi-Band Spectral Guide",
            "FAO Global Agroecosystem Assessment"
        ]

    return ChatResponse(response=reply, sources=sources)
