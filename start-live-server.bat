@echo off
title Arya Sree Ashok - Portfolio Live Server
echo ========================================================
echo Starting Local Live Server for Portfolio Website...
echo ========================================================
cd /d "%~dp0"
echo Server directory: %CD%
echo Opening browser at http://localhost:3000 ...
start http://localhost:3000
echo.
echo Server is running! Press Ctrl+C in this window to stop it.
python -m http.server 3000
pause
