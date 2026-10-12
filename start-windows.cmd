@echo off
setlocal
cd /d "%~dp0"
echo Open http://127.0.0.1:8787 in your browser after the server starts.
echo Keep this window open. Press Ctrl+C to stop.
go run .
if errorlevel 1 pause
