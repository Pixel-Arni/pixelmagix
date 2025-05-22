from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from pathlib import Path

# Basisverzeichnis des Projekts ermitteln
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent

# Datenverzeichnis erstellen, falls es nicht existiert
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)

# Datenbankdatei im Datenverzeichnis
DATABASE_URL = f"sqlite:///{os.path.join(DATA_DIR, 'pixelmagix.db')}"

# Engine erstellen
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# SessionLocal-Klasse erstellen
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base-Klasse für Modelle
Base = declarative_base()


def get_db():
    """
    Dependency für FastAPI, um eine Datenbankverbindung bereitzustellen.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Initialisiert die Datenbank und erstellt alle Tabellen.
    """
    from .models import Base
    Base.metadata.create_all(bind=engine)
    
    # Hier könnten Standardeinstellungen oder -daten eingefügt werden
    from .models import Setting
    from sqlalchemy.orm import Session
    
    db = SessionLocal()
    try:
        # Überprüfen, ob bereits Einstellungen vorhanden sind
        if db.query(Setting).count() == 0:
            # Standardeinstellungen einfügen
            default_settings = [
                Setting(key="site_name", value="PixelMagix", type="string"),
                Setting(key="site_description", value="Ein lokales CMS für Landingpages", type="string"),
                Setting(key="default_export_path", value=str(os.path.join(BASE_DIR, "exports")), type="string"),
                Setting(key="enable_ai", value="true", type="boolean"),
            ]
            db.add_all(default_settings)
            db.commit()
    finally:
        db.close()