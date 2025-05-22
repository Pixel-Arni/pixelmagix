from fastapi import APIRouter

from .pages import router as pages_router
from .assets import router as assets_router
from .ai import router as ai_router

# Hauptrouter für alle API-Endpunkte
api_router = APIRouter()

# Unterrouter einbinden
api_router.include_router(pages_router, prefix="/pages", tags=["pages"])
api_router.include_router(assets_router, prefix="/assets", tags=["assets"])
api_router.include_router(ai_router, prefix="/ai", tags=["ai"])

__all__ = ["api_router"]