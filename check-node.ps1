# Check what's locking the Prisma engine file
$prismaDir = "D:\SEPTA-PROJECT\node_modules\.prisma\client"
$engineFile = Join-Path $prismaDir "query_engine-windows.dll.node"

Write-Host "Checking: $engineFile"
if (Test-Path $engineFile) {
    Write-Host "File exists, size: $((Get-Item $engineFile).Length)"
    Write-Host "Trying to get file handles..."

    # Try with handle.exe if available
    $handle = Get-Command handle.exe -ErrorAction SilentlyContinue
    if ($handle) {
        & handle.exe $engineFile
    } else {
        Write-Host "handle.exe not found. Try running as admin or close VS Code / antivirus."
    }
} else {
    Write-Host "File does not exist yet."
}

# Also show temp files
$tempFiles = Get-ChildItem $prismaDir -Filter "*.tmp*" -ErrorAction SilentlyContinue
Write-Host "Temp files in .prisma/client:"
$tempFiles | ForEach-Object { Write-Host $_.Name }