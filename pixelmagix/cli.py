"""Command line interface for Pixelmagix."""

import click

from . import __version__
from .builder import build_landing_page
from .exporter import export_zip
from .database import init_db, add_customer, list_customers


@click.group()
@click.version_option(__version__)
def cli() -> None:
    """Pixelmagix CLI entry point."""
    pass


@cli.command()
def init() -> None:
    """Initialise local database."""
    init_db()
    click.echo("Database initialised.")


@cli.command()
@click.argument("name")
@click.argument("email")
def addcustomer(name: str, email: str) -> None:
    """Add a new customer."""
    add_customer(name, email)
    click.echo(f"Customer {name} added.")


@cli.command()
def customers() -> None:
    """List existing customers."""
    for cust in list_customers():
        click.echo(f"{cust['id']}: {cust['name']} <{cust['email']}>")


@cli.command()
@click.argument("title")
@click.argument("output")
def build(title: str, output: str) -> None:
    """Build a landing page from the default template."""
    build_landing_page(title, output)
    click.echo(f"Landing page written to {output}")


@cli.command()
@click.argument("directory")
@click.argument("zip_path")
def export(directory: str, zip_path: str) -> None:
    """Export a directory as a ZIP archive."""
    export_zip(directory, zip_path)
    click.echo(f"Exported {directory} -> {zip_path}")


if __name__ == "__main__":
    cli()
