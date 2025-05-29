# Pixelmagix PowerShell Starter
$Host.UI.RawUI.WindowTitle = "Pixelmagix Development Server"

Write-Host "===== Pixelmagix Projekt Starter =====" -ForegroundColor Cyan
Write-Host ""

# Ins Skript-Verzeichnis wechseln
Set-Location -Path $PSScriptRoot
Write-Host "[INFO] Arbeitsverzeichnis: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# Node.js prüfen
try {
    $nodeVersion = node --version 2>$null
    Write-Host "[OK] Node.js gefunden: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[FEHLER] Node.js nicht gefunden!" -ForegroundColor Red
    Write-Host "Installieren Sie Node.js von https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Drücken Sie Enter zum Beenden"
    exit 1
}

# npm prüfen
try {
    $npmVersion = npm --version 2>$null
    Write-Host "[OK] npm gefunden: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "[FEHLER] npm nicht gefunden!" -ForegroundColor Red
    Read-Host "Drücken Sie Enter zum Beenden"
    exit 1
}

Write-Host ""

# package.json prüfen
if (-not (Test-Path "package.json")) {
    Write-Host "[FEHLER] package.json nicht gefunden!" -ForegroundColor Red
    Write-Host "Verzeichnis: $(Get-Location)" -ForegroundColor Yellow
    Read-Host "Drücken Sie Enter zum Beenden"
    exit 1
}

Write-Host "[OK] package.json gefunden" -ForegroundColor Green

# Dependencies prüfen und installieren
if (-not (Test-Path "node_modules") -or (Get-ChildItem "node_modules" -ErrorAction SilentlyContinue).Count -eq 0) {
    Write-Host ""
    Write-Host "[INFO] Installiere Dependencies..." -ForegroundColor Yellow
    Write-Host "Das kann einige Minuten dauern..." -ForegroundColor Gray
    
    try {
        npm ci
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[WARNUNG] npm ci fehlgeschlagen, versuche npm install..." -ForegroundColor Yellow
            npm install
        }
        Write-Host "[OK] Dependencies erfolgreich installiert!" -ForegroundColor Green
    } catch {
        Write-Host "[FEHLER] Installation fehlgeschlagen!" -ForegroundColor Red
        Read-Host "Drücken Sie Enter zum Beenden"
        exit 1
    }
} else {
    Write-Host "[OK] Dependencies sind bereits installiert" -ForegroundColor Green
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Starte Pixelmagix Development Server..." -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Browser öffnet automatisch: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "[HINWEIS] Zum Beenden drücken Sie Strg+C" -ForegroundColor Gray
Write-Host ""

# Server starten
try {
    npm run dev
} catch {
    Write-Host ""
    Write-Host "[FEHLER] Server konnte nicht gestartet werden!" -ForegroundColor Red
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Server wurde beendet." -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
Read-Host "Drücken Sie Enter zum Schließen"