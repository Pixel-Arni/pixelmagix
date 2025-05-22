from fastapi import APIRouter

from .plugin_routes import router as plugin_router
from .ai_routes import router as ai_router

# Hauptrouter für alle API-Endpunkte
api_router = APIRouter()

# Unterrouter einbinden
api_router.include_router(plugin_router)
api_router.include_router(ai_router)

# Weitere Router hier einbinden, z.B. für Pages, Assets, etc.
# api_router.include_router(pages_router)
# api_router.include_router(assets_router)

__all__ = ["api_router"]