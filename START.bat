@echo off
title ViorelShop
cls
echo ViorelShop - Jipeanu Viorel
echo Pornesc serverele...

cd /d "%~dp0backend" && start /B node server.js
cd /d "%~dp0frontend" && start /B npm run dev

echo Se incarca...
timeout /t 12 /nobreak >nul

echo Gata! Deschid browser...
start http://localhost:3000

echo http://localhost:3000
echo Inchide fereastra pentru STOP
pause