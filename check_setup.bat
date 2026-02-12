@echo off
echo ========================================
echo   GovScheme Assistant - Setup Check
echo ========================================
echo.

REM Check Python
echo [1/4] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python NOT found
    echo    Please install Python 3.8+ from https://www.python.org/
) else (
    python --version
    echo ✅ Python found
)
echo.

REM Check Node.js
echo [2/4] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js NOT found
    echo    Please install Node.js from https://nodejs.org/
) else (
    node --version
    echo ✅ Node.js found
)
echo.

REM Check npm
echo [3/4] Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm NOT found
) else (
    npm --version
    echo ✅ npm found
)
echo.

REM Check .env file
echo [4/4] Checking .env configuration...
if exist ".env" (
    findstr /C:"your_api_key_here" .env >nul
    if errorlevel 1 (
        echo ✅ .env file exists and appears configured
    ) else (
        echo ⚠️  .env file exists but needs API key
        echo    Please add your Gemini API key to .env
    )
) else (
    echo ❌ .env file NOT found
    echo    Please create .env file with your API key
)
echo.

echo ========================================
echo   Setup Check Complete
echo ========================================
echo.
echo Next steps:
echo 1. Get your Gemini API key from https://makersuite.google.com/app/apikey
echo 2. Add it to the .env file
echo 3. Run start_app.bat to launch the application
echo.
pause
