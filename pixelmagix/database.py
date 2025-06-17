"""SQLite database utilities for storing customers."""

import sqlite3
from pathlib import Path
from typing import Iterable

DB_PATH = Path("pixelmagix.db")


def init_db() -> None:
    """Initialise the SQLite database."""
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)"
    )
    conn.commit()
    conn.close()


def add_customer(name: str, email: str) -> None:
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("INSERT INTO customers (name, email) VALUES (?, ?)", (name, email))
    conn.commit()
    conn.close()


def list_customers() -> Iterable[dict[str, str]]:
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT id, name, email FROM customers")
    rows = cur.fetchall()
    conn.close()
    for row in rows:
        yield {"id": row[0], "name": row[1], "email": row[2]}
