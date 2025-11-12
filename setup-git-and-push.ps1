# Script para inicializar repo Git local e fazer push para GitHub
# Uso: .\setup-git-and-push.ps1

Write-Host "=== Inicializando repositorio Git local ===" -ForegroundColor Green

# 1. Inicializar o repositorio
Write-Host "`n[1/5] Inicializando git repo..."
git init
if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha ao inicializar repo"
    exit 1
}

# 2. Criar/renomear branch para 'main'
Write-Host "`n[2/5] Configurando branch 'main'..."
git branch -M main
if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha ao renomear branch"
    exit 1
}

# 3. Verificar .gitignore
Write-Host "`n[3/5] Verificando .gitignore..."
if (Test-Path .gitignore) {
    Write-Host ".gitignore encontrado. Conteudo:"
    Get-Content .gitignore | Select-Object -First 5
    Write-Host "..."
} else {
    Write-Error ".gitignore nao encontrado!"
    exit 1
}

# 4. Adicionar arquivos e commitar (node_modules sera ignorado)
Write-Host "`n[4/5] Adicionando arquivos e commitando..."
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha ao adicionar arquivos"
    exit 1
}

git commit -m "Initial commit: RPG Master Manager project"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha ao commitar"
    exit 1
}

# 5. Adicionar remote e fazer push
Write-Host "`n[5/5] Adicionando remote 'origin' e fazendo push..."
git remote add origin https://github.com/Jgui18/RPG-Master-Manager.git 2>$null
# Ignorar erro se remote ja existe
Write-Host "Remote 'origin' configurado (ou ja existia)"

git push -u origin main
if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha ao fazer push"
    Write-Host "`nDica: Se a autenticacao falhou, pode ser necessario:"
    Write-Host "  - Usar um Personal Access Token (PAT) ao inves de senha"
    Write-Host "  - Autenticar com: gh auth login (se tiver GitHub CLI)"
    exit 1
}

Write-Host "`n=== OK Push concluido com sucesso! ===" -ForegroundColor Green
Write-Host "Repositorio disponivel em: https://github.com/Jgui18/RPG-Master-Manager"
