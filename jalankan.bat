@echo off
start "Backend" cmd /k "cd /d %~dp0backend && npm run dev"
start "Frontend" cmd /k "cd /d %~dp0frontend\CatUangKu && npm run dev"
timeout /t 3 >nul
start "" http://localhost:5173