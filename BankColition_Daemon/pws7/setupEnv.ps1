$RootPath = $PSScriptRoot
$env:Desactivate = "$RootPath\.venv\Scripts\deactivate.bat"
$env:BankColition = "$RootPath\execDaemon.ps1"

Write-Host "Create a VirtualEnv"

python3 -m pip install -q --upgrade pip --no-warn-script-location
python3 -m pip install -q virtualenv --no-warn-script-location --disable-pip-version-check

if (Test-Path $RootPath\.virtualenv) {
    Write-Host "VirtualEnv setup"
}
    else
{
    python3 -m virtualenv .virtualenv
    Write-Host "VirtualEnv setup"
}

if (Test-Path $RootPath\Temp) {
    Write-Host "Temp Folder Exists"
}
    else
{
    New-Item -Path "$RootPath\Temp" -ItemType Directory
    Write-Host "Temp Folder Created"
}

. "$RootPath\.virtualenv\Scripts\Activate.ps1" && Write-Host "Validate requirements" && pip install -q -r "$RootPath\script\requirements.txt" --no-warn-script-location && Write-Host "VirtualEnv created successfully" && deactivate 