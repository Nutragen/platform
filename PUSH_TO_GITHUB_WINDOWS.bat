@echo off
echo ================================================
echo   Nutragen Central - Push to GitHub
echo   Repo: airosatech-dev/nutragencentral
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
git commit -m "latest update" >nul 2>&1
git branch -M main
git push -u origin main --force

echo.
if %errorlevel% equ 0 (
    echo ================================================
    echo  SUCCESS! Vercel will redeploy automatically.
    echo  Check: https://vercel.com/dashboard
    echo ================================================
) else (
    echo ================================================
    echo  Push failed. Try again with a fresh token:
    echo  github.com/settings/tokens/new
    echo  Check: repo box, No expiration
    echo ================================================
)
pause
