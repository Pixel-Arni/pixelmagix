@echo off
echo ===== Pixelmagix Projekt Starter =====
echo.

REM Prüfen, ob Node.js installiert ist
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Fehler: Node.js ist nicht installiert oder nicht im PATH.
    echo Bitte installieren Sie Node.js von https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js gefunden: 
node --version
echo.

REM Prüfen, ob npm installiert ist
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Fehler: npm ist nicht installiert oder nicht im PATH.
    echo Bitte installieren Sie Node.js mit npm von https://nodejs.org/
    pause
    exit /b 1
)

echo npm gefunden: 
npm --version
echo.

REM Ins Projektverzeichnis wechseln
cd /d "%~dp0"
echo Arbeitsverzeichnis: %CD%
echo.

REM Prüfen, ob node_modules existiert
if not exist node_modules (
    echo node_modules nicht gefunden. Installiere Abhängigkeiten...
    npm install
    if %ERRORLEVEL% neq 0 (
        echo Fehler beim Installieren der Abhängigkeiten.
        pause
        exit /b 1
    )
) else (
    echo node_modules gefunden. Überspringe Installation.
)

echo.
echo Starte den Entwicklungsserver...
echo.
echo Drücken Sie Strg+C, um den Server zu beenden.
echo.

npm run dev

pause