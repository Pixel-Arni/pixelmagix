"""Utilities for exporting built sites as ZIP archives."""

from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED


def export_zip(directory: str, zip_path: str) -> None:
    """Export the given directory as a ZIP file."""
    base_dir = Path(directory)
    with ZipFile(zip_path, "w", ZIP_DEFLATED) as zipf:
        for file in base_dir.rglob("*"):
            if file.is_file():
                zipf.write(file, arcname=file.relative_to(base_dir))
