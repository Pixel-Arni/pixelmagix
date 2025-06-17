#!/usr/bin/env python3
"""Setup dependencies and launch the Pixelmagix GUI."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def main() -> None:
    """Install requirements and run the GUI."""
    req_file = ROOT / "requirements.txt"
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", str(req_file)])
    subprocess.check_call([sys.executable, "-m", "pixelmagix.gui"])


if __name__ == "__main__":
    main()
