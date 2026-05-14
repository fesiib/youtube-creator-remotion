param(
  [Parameter(Mandatory=$true)]
  [string]$Name
)

$ErrorActionPreference = "Stop"

function Need-Cmd($CommandName) {
  if (-not (Get-Command $CommandName -ErrorAction SilentlyContinue)) {
    throw "Missing required command: $CommandName"
  }
}

Need-Cmd git
Need-Cmd node
Need-Cmd npm
Need-Cmd claude

Write-Host "Git:    $(git --version)"
Write-Host "Node:   $(node --version)"
Write-Host "npm:    $(npm --version)"
Write-Host "Claude: $(claude --version)"

Write-Host "Installing project dependencies..."
npm install

$branch = "study/$Name"
$current = git branch --show-current
if ($current -ne $branch) {
  $exists = git branch --list $branch
  if ($exists) {
    git checkout $branch
  } else {
    git checkout -b $branch
  }
}

New-Item -ItemType Directory -Force -Path ".claude" | Out-Null
if (-not (Test-Path ".claude/settings.local.json")) {
@'
{
  "env": {
    "AWS_BEARER_TOKEN_BEDROCK": "PASTE_YOUR_BEDROCK_KEY_HERE"
  }
}
'@ | Set-Content ".claude/settings.local.json"
}

Write-Host ""
Write-Host "Setup complete."
Write-Host "Branch: $branch"
Write-Host "Next steps:"
Write-Host "1. Open .claude/settings.local.json and paste your Bedrock key into AWS_BEARER_TOKEN_BEDROCK."
Write-Host "2. Run 'claude' in the terminal, or open this folder in VSCode and use the Claude Code extension."
