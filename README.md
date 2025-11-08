# AI Code Review CLI (Windows)

A local AI-powered code reviewer that runs automatically before Git commits.  
It reviews your staged changes using OpenAI's API and lets you decide whether to proceed with the commit or fix issues first.  

Works on **Windows (CMD, PowerShell, Git Bash, or Windows Terminal)**.

---

## ⚡ Features

- Reviews staged Git changes automatically
- Prints issues directly in the console
- Lets you **accept or cancel commits**
- Reads your OpenAI API key from a **`.env` file** in the project root
- Works globally on all Git repositories

---

## 🛠️ Full Setup Instructions

Follow these steps to get it running on your machine.

---

### 1️⃣ Clone the repository

```powershell
git clone https://github.com/your-username/ai_review_agent.git
cd ai_review_agent


2️⃣ Install Node.js dependencies

Make sure Node.js is installed. Then run:

npm install


This installs all required packages (openai, dotenv, etc.).

3️⃣ Set your OpenAI API Key in .env

Create a .env file in the project root (ai_review_agent/.env) with the following content:

OPENAI_API_KEY=sk-XXXXXXXXXXXXXXXXXXXXXXXX
AI_REVIEW_MODEL=gpt-4.1-mini


Do not use quotes around the key.

The script (index.js) automatically loads .env using dotenv.

4️⃣ Install the Global Git Pre-commit Hook

Run the following PowerShell block from any folder:

$hookPath="$env:USERPROFILE\.githooks\pre-commit"
mkdir -Force $env:USERPROFILE\.githooks
@'
#!/bin/bash
echo "Running AI code review..."
node "$HOME\ai_review_agent\index.js"
status=$?
if [ $status -ne 0 ]; then
  echo "Commit blocked by AI review."
  exit 1
fi
'@ | Out-File -Encoding UTF8 -NoNewline $hookPath

# Make it executable in Git Bash
git bash -c "chmod +x ~/.githooks/pre-commit"

# Set Git global hooks path
git config --global core.hooksPath "$env:USERPROFILE\.githooks"


✅ This installs the hook globally, so it runs on every Git repository on your machine.

5️⃣ Test the Setup

Go to any Git repository and stage a change:

git add .


Commit:

git commit -m "Test AI review"


You should see something like:

--- Running AI code review ---

===== AI Review =====
⚠️ Potential issue detected in src/app.js line 42
=====================

AI found potential issues.
Do you want to proceed with the commit? (y/n):


Type y → commit proceeds

Type n → commit is canceled so you can fix issues

If there are no issues, the console shows:

===== AI Review =====
No issues found.
=====================
Do you want to proceed with the commit? (y/n):

6️⃣ Optional Notes

Works best in Git Bash or Windows Terminal.

Sensitive code is sent to OpenAI — avoid using on secret repositories unless you are comfortable.

✅ Quick Summary

Clone repo:

git clone https://github.com/your-username/ai_review_agent.git
cd ai_review_agent


Install dependencies:

npm install


Create .env with your API key:

OPENAI_API_KEY=sk-...
AI_REVIEW_MODEL=gpt-4.1-mini


Run global hook installation (PowerShell block above)

Stage changes & commit → AI reviewer runs

Accept (y) or cancel (n) commit based on AI feedback