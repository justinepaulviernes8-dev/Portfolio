param([int]$Port = 8000)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$phpCommand = Get-Command php -ErrorAction SilentlyContinue
$phpExecutable = if (Test-Path 'C:\xampp\php\php.exe') { 'C:\xampp\php\php.exe' } elseif ($phpCommand) { $phpCommand.Source } else { throw 'PHP 8.2+ is required. Install PHP and add it to PATH.' }
Push-Location (Join-Path $projectRoot 'public')
try {
    Write-Host "Portfolio: http://127.0.0.1:$Port"
    Write-Host "Project manager: http://127.0.0.1:$Port/projects"
    Write-Host 'Start MySQL in XAMPP before using the portfolio.'
    Write-Host 'Press Ctrl+C to stop.'
    & $phpExecutable -d upload_max_filesize=8M -d post_max_size=12M -S "127.0.0.1:$Port" '../vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php'
} finally { Pop-Location }
