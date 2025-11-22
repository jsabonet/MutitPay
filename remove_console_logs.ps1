# Script para remover todos os console.log do codigo de producao

$frontendPath = "D:\Projectos\MutitPay\frontend\src"

# Padroes para encontrar
$patterns = @(
    'console\.log\([^)]*\);?',
    'console\.warn\([^)]*\);?',
    'console\.error\([^)]*\);?',
    'console\.debug\([^)]*\);?',
    'console\.info\([^)]*\);?'
)

$count = 0
$filesModified = 0

# Buscar todos os arquivos .ts e .tsx
Get-ChildItem -Path $frontendPath -Recurse -Include *.ts,*.tsx | ForEach-Object {
    $file = $_
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    
    # Skip se o arquivo está vazio ou não pode ser lido
    if ([string]::IsNullOrEmpty($content)) {
        return
    }
    
    $fileChanged = $false
    
    foreach ($pattern in $patterns) {
        $matches = [regex]::Matches($content, $pattern)
        if ($matches.Count -gt 0) {
            $count += $matches.Count
            $fileChanged = $true
            # Remover cada match
            $content = $content -replace $pattern, ''
        }
    }
    
    # Remover linhas vazias extras que sobraram
    $content = $content -replace '(?m)^\s*$\r?\n\s*$\r?\n', "`n"
    
    if ($fileChanged) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $filesModified++
        Write-Host "OK: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================"
Write-Host "Remocao concluida!"
Write-Host "Arquivos modificados: $filesModified"
Write-Host "Console.log removidos: $count"
Write-Host "========================================"
