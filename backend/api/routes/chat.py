from ninja import Router
from ..schemas.chat import ChatRequest, ChatResponse

router = Router(tags=["AI Assistant Command Center"])

@router.post("/ask", response=ChatResponse)
def ask_ai_assistant(request, data: ChatRequest):
    """
    Answers geospatial and agronomic questions utilizing a simulated RAG vector store.
    """
    msg = data.message.lower()
    scenario = data.scenario or ""
    
    # 1. Climate-Smart Agriculture Scenario
    if "climate" in msg or "irrigation" in msg or scenario == "Climate-Smart Agriculture":
        reply = (
            "Based on current microclimate sensor logs (Soil Temp: 24-26°C, Land Surface Temp: 28-31°C) and a Vapor "
            "Pressure Deficit (VPD) of ~2.3 kPa, our models indicate moderate transpiration stress. We recommend "
            "scheduling micro-sprinkler irrigation cycles during low-evaporative windows (early morning or late evening). "
            "To build long-term climate resilience, consider planting leguminous cover crops to optimize soil moisture retention."
        )
        sources = ["CHIRPS Precipitation Grids Q2-2026", "FAO Irrigation & Drainage Paper 56", "Plot Telemetry Probes"]
        
    # 2. Land Restoration Scenario
    elif "restoration" in msg or "canopy" in msg or scenario == "Land Restoration":
        reply = (
            "Auditing restoration zones confirms Canopy Reforestation (Zone Alpha) has achieved 88% progression with a "
            "94% sapling survival rate (1,200 active trees). Riparian Buffer Zone (Zone Gamma) has the highest density with "
            "2,100 trees and 68.4 tCO2e carbon offsets. To boost the overall biodiversity score (currently 92% in Zone Alpha), "
            "we suggest planting additional native species in the gaps identified by PlanetScope drone imagery."
        )
        sources = ["VCS Forest Regrowth Protocol VM0047", "AgroMonitor Canopy Progress Ledger", "Sentinel-2 Classification Layer"]
        
    # 3. Carbon Registry Scenario
    elif "carbon" in msg or "credit" in msg or scenario == "Carbon Registry":
        reply = (
            "The estate's average carbon density stands at 58.2 tCO2e/HA. Verification files indicate a total of "
            "145.4 tCO2e sequestered across the active plots. Cryptographic SHA-256 hashes of these reports have been "
            "published onto the Polygon mainnet blockchain (EVM). These records provide immutable proof of audit integrity, "
            "complying with Gold Standard carbon credit verification requirements."
        )
        sources = ["IPCC Greenhouse Gas Inventory Guide", "Polygon MRV Ledger Smart Contract", "Gold Standard Land Registry"]
        
    # 4. Traceability Scenario
    elif "trace" in msg or "eudr" in msg or "deforest" in msg or scenario == "Traceability":
        reply = (
            "EU Deforestation Regulation (EUDR) compliance requires zero forest-to-agricultural land conversion since the "
            "cutoff date of December 31, 2020. Our audit shows Plot Alpha (West Valley) and Plot Beta (East Valley) are fully "
            "compliant with zero canopy anomalies. Plot Gamma (North Ridge) has flagged a 14.5% canopy reduction anomaly. "
            "You can export the official traceability certificate detailing the PostGIS boundary shapes in the Reports tab."
        )
        sources = ["EU Deforestation Regulation (EUDR) Guidance Doc", "Sentinel-2 RedEdge Forest Canopy Index", "PostGIS Overlap Checker"]
        
    # 5. Default Response
    else:
        reply = (
            "Hello! I am your Farmintelytics Spatial AI Assistant. I have access to real-time microclimate sensors, "
            "Copernicus Sentinel-2 satellite indices (NDVI/NDMI/EVI), EUDR deforestation audits, and blockchain "
            "MRV carbon certificates. Please select one of the quick scenario buttons or ask me a specific question."
        )
        sources = ["Farmintelytics Spatial Help Center", "Sentinel-2 Multi-Band Guide"]
        
    return ChatResponse(
        response=reply,
        sources=sources
    )
