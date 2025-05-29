@echo off

REM Prüfen, ob das Skript bereits in einer persistenten CMD-Instanz läuft
if "%PERSISTENT_CMD%"=="1" goto :main

REM Starte das Skript in einer neuen CMD-Instanz, die offen bleibt
set PERSISTENT_CMD=1
cmd /k "%~f0"
exit /b

:main
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

REM Arbeitsverzeichnis anzeigen (ohne zu wechseln)
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
echo Starte den Entwicklungsserver und öffne den Browser...
echo.
echo Drücken Sie Strg+C, um den Server zu beenden.
echo.

REM Starte den Server im aktuellen Fenster und öffne den Browser automatisch
npx vite --open

echo.
echo Der Server wurde beendet. Drücken Sie eine beliebige Taste, um das Fenster zu schließen.
pause > nul