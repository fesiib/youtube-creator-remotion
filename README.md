# Remote Study Setup: Claude Code Video Prototyping

Welcome! In this study, you will use Claude Code to make a few videos for your (imaginary) YouTube channel that uses animations. 
At the end of the study, export your Claude Code transcript and push your work and transcript to a new Git branch.

## What you need

- Git
- Node.js LTS + npm
- Claude Code
- Access to this GitHub repository
- A Bedrock access key provided by the study organizer (will be provided during the study)

If anything fails, copy the terminal output and send it to the study organizer.

---

## 1. Install prerequisites

### Git

Check whether Git is installed:

```bash
git --version
```

If not installed:

- macOS: install Xcode Command Line Tools when prompted, or install Git from <https://git-scm.com/downloads>
- Windows: install Git for Windows from <https://git-scm.com/download/win>
- Linux: install with your package manager, e.g. `sudo apt install git`

### Node.js and npm

Install the current LTS version from:

<https://nodejs.org/>

Then check:

```bash
node --version
npm --version
```

### Claude Code

Install Claude Code.

macOS / Linux / WSL:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Windows PowerShell:

```powershell
irm https://claude.ai/install.ps1 | iex
```

Then check:

```bash
claude --version
```

---

## 2. Clone the study repository

```bash
git clone https://github.com/fesiib/youtube-creator-remotion.git
cd youtube-creator-remotion
```

---

## 3. Run the setup script

Replace `{name}` with your name (e.g., `bekzat`) in the commands below. Use the same `{name}` again in Sections 7 and 8.

macOS / Linux / WSL:

```bash
bash scripts/setup-study.sh {name}
```

Windows PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/setup-study.ps1 {name}
```

The script will:

- check Git, Node.js, npm, and Claude Code
- install project dependencies with `npm install`
- create your Git branch, e.g. `study/{name}`
- create a local `.claude/settings.local.json` file where you'll paste your Bedrock key

---

## 4. Make sure Remotion runs

**Start preview:**

```console
npm run dev
```

**Render video:**

```console
npx remotion render
```

---

## 5. Add your Bedrock key and start Claude Code

Open `.claude/settings.local.json` and paste the Bedrock key you received from the study organizer:

```json
{
  "env": {
    "AWS_BEARER_TOKEN_BEDROCK": "PASTE_YOUR_KEY_HERE"
  }
}
```

This file is gitignored, so the key stays local. Do not share it.

You can use Claude Code in either of two ways — both read the same configuration:

**Terminal:**

```bash
claude
```

**VSCode extension:**

1. Install the **Claude Code** extension from the marketplace.
2. If you're already signed in to a personal Claude account in the extension, sign out first — otherwise the extension will use your personal account instead of the study's Bedrock config.
3. Open this repo as a workspace and click the Claude icon in the side panel.

The committed `.claude/settings.json` configures Bedrock and Opus 4.7 for both paths, so no extra login is needed.

---

## 6. Complete the study task

Follow the task description given by the study organizer.

General rules:

- Keep all work inside this repository.
- Do not delete study files.

---

## 7. Export your Claude Code transcript

When finished, just manually copy-paste the entire chat transcript to `./transcript.txt` file.
If it is difficult to copy, you can ask Claude to `Generate the entire transcript of the conversation`.
No formatting necessary.

---

## 8. Commit and push your work

```bash
git status
git add .
git commit -m "study: finished"
git push origin study/{name}
```

---

## Troubleshooting

### `claude` command not found

Restart your terminal and try again. If it still fails, reinstall Claude Code.

### Bedrock/authentication error

Check that `.claude/settings.local.json` contains your real Bedrock key:

```json
{
  "env": {
    "AWS_BEARER_TOKEN_BEDROCK": "your-key"
  }
}
```

The other Bedrock settings (region, model IDs, `CLAUDE_CODE_USE_BEDROCK=1`) are already in the committed `.claude/settings.json` and don't need to be duplicated.

If it still fails, contact the organizer.

### VSCode extension doesn't pick up the key

Make sure the key is in `.claude/settings.local.json` (not in your shell environment), then reload the VSCode window (Cmd/Ctrl+Shift+P → "Developer: Reload Window"). If you're signed in to a personal Claude account in the extension, sign out — the extension will prefer the personal account over the study's Bedrock config.

### `npm install` fails

Copy the full error message and send it to the study organizer.