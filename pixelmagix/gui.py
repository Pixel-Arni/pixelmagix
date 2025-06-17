"""Simple Tkinter UI for Pixelmagix."""

from __future__ import annotations

import tkinter as tk
from tkinter import filedialog, messagebox

from .builder import build_landing_page
from .database import add_customer, init_db, list_customers
from .exporter import export_zip


class PixelmagixGUI(tk.Tk):
    """A minimal UI to access Pixelmagix functions."""

    def __init__(self) -> None:
        super().__init__()
        self.title("Pixelmagix")
        self.geometry("400x600")

        # Database controls
        tk.Button(self, text="Init Database", command=self.on_init_db).pack(pady=5)

        # Add customer
        tk.Label(self, text="Name").pack()
        self.name_entry = tk.Entry(self)
        self.name_entry.pack(fill="x", padx=10)
        tk.Label(self, text="Email").pack()
        self.email_entry = tk.Entry(self)
        self.email_entry.pack(fill="x", padx=10)
        tk.Button(self, text="Add Customer", command=self.on_add_customer).pack(pady=5)

        # List customers
        tk.Button(self, text="List Customers", command=self.on_list_customers).pack(
            pady=5
        )

        # Build page
        tk.Label(self, text="Page Title").pack()
        self.page_title = tk.Entry(self)
        self.page_title.pack(fill="x", padx=10)
        tk.Button(self, text="Select Output HTML", command=self.select_output).pack()
        self.output_var = tk.StringVar()
        tk.Entry(self, textvariable=self.output_var).pack(fill="x", padx=10)
        tk.Button(self, text="Build Page", command=self.on_build).pack(pady=5)

        # Export directory
        tk.Button(self, text="Select Directory", command=self.select_directory).pack()
        self.dir_var = tk.StringVar()
        tk.Entry(self, textvariable=self.dir_var).pack(fill="x", padx=10)
        tk.Button(self, text="Select Zip File", command=self.select_zip).pack()
        self.zip_var = tk.StringVar()
        tk.Entry(self, textvariable=self.zip_var).pack(fill="x", padx=10)
        tk.Button(self, text="Export Directory", command=self.on_export).pack(pady=5)

    # Database actions
    def on_init_db(self) -> None:
        init_db()
        messagebox.showinfo("Pixelmagix", "Database initialised")

    def on_add_customer(self) -> None:
        name = self.name_entry.get().strip()
        email = self.email_entry.get().strip()
        if not name or not email:
            messagebox.showerror("Pixelmagix", "Name and email required")
            return
        add_customer(name, email)
        messagebox.showinfo("Pixelmagix", f"Customer {name} added")

    def on_list_customers(self) -> None:
        customers = list(list_customers())
        if not customers:
            messagebox.showinfo("Pixelmagix", "No customers")
            return
        text = "\n".join(f"{c['id']}: {c['name']} <{c['email']}>" for c in customers)
        messagebox.showinfo("Pixelmagix Customers", text)

    # Build actions
    def select_output(self) -> None:
        path = filedialog.asksaveasfilename(defaultextension=".html")
        if path:
            self.output_var.set(path)

    def on_build(self) -> None:
        title = self.page_title.get().strip()
        output = self.output_var.get().strip()
        if not title or not output:
            messagebox.showerror("Pixelmagix", "Title and output path required")
            return
        build_landing_page(title, output)
        messagebox.showinfo("Pixelmagix", f"Landing page written to {output}")

    # Export actions
    def select_directory(self) -> None:
        path = filedialog.askdirectory()
        if path:
            self.dir_var.set(path)

    def select_zip(self) -> None:
        path = filedialog.asksaveasfilename(defaultextension=".zip")
        if path:
            self.zip_var.set(path)

    def on_export(self) -> None:
        directory = self.dir_var.get().strip()
        zip_path = self.zip_var.get().strip()
        if not directory or not zip_path:
            messagebox.showerror("Pixelmagix", "Directory and zip path required")
            return
        export_zip(directory, zip_path)
        messagebox.showinfo("Pixelmagix", f"Exported {directory} -> {zip_path}")


def main() -> None:
    gui = PixelmagixGUI()
    gui.mainloop()


if __name__ == "__main__":
    main()
