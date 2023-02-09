@echo off
set _FOLDER=%~dp0
set _EXEC=%_FOLDER%startBankColition.ps1

PowerShell.exe -ExecutionPolicy Bypass -Command "& '%_EXEC%'"

PAUSE
