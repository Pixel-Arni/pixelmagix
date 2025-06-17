"""Simple landing page builder using Jinja2 templates."""

from pathlib import Path
from typing import Any

from jinja2 import Environment, FileSystemLoader

TEMPLATES_DIR = Path(__file__).parent / "templates"

_env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))


def build_landing_page(
    title: str, output_path: str, context: dict[str, Any] | None = None
) -> None:
    """Render the default template with provided context."""
    context = context or {}
    context.setdefault("title", title)
    context.setdefault("heading", title)
    context.setdefault("content", "Hello from Pixelmagix!")
    template = _env.get_template("base.html")
    rendered = template.render(**context)
    Path(output_path).write_text(rendered, encoding="utf-8")
