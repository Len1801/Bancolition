$RootPath = $PSScriptRoot

Write-Host "Daemon starts"

. "$RootPath\.virtualenv\Scripts\Activate.ps1" && python "$RootPath\script\loadCartolas.py" && deactivate

Write-Host "Daemon complete successfully"