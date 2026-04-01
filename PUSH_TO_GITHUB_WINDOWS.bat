@echo off
echo ================================================
echo   Nutragen Central - Push to GitHub
echo ================================================
echo.
echo Paste your Personal Access Token (ghp_...)
echo Right-click to paste, then press Enter
echo.
set /p TOKEN=Token: 
git remote remove origin >nul 2>&1
git remote add origin https://airosatech-dev:%TOKEN%@github.com/airosatech-dev/nutragencentral.git
git init >nul 2>&1
git add .
git commit -m "pearl theme update" >nul 2>&1
git branch -M main
git push -u origin main --force
echo.
if %errorlevel% equ 0 (echo SUCCESS! Vercel will redeploy automatically.) else (echo Push failed. Check your token.)
pause
