# AI Code Review CLI (Windows)

A local AI-powered code reviewer that runs automatically before Git commits.  
It reviews your staged changes using OpenAI's API and lets you decide whether to proceed with the commit or fix issues first.  

Works on **Windows (CMD, PowerShell, Git Bash, or Windows Terminal)**.

---

## ⚡ Features

- Reviews staged Git changes automatically
- Prints issues directly in the console
- Lets you **accept or cancel commits**
- Saves full report to `.ai-review.log`
- Works globally on all Git repositories

---

## 🛠️ Full Setup Instructions

Follow these steps to get it running on your machine.

---

### 1️⃣ Clone the repository

```powershell
git clone https://github.com/your-username/ai-code-review.git
cd ai-code-review

2️⃣ Install Node.js dependencies

Make sure Node.js is installed. Then run:

npm install


This installs all required packages (like openai).

3️⃣ Set your OpenAI API Key

Create an API key at OpenAI
.

Then set it in Windows (PowerShell):

setx OPENAI_API_KEY "sk-XXXXXXXXXXXXXXXXXXXX"


Close and reopen your terminal to apply the environment variable.

4️⃣ Install the Global Git Pre-commit Hook

Run the following PowerShell block from any folder:

$hookPath="$env:USERPROFILE\.githooks\pre-commit"
mkdir -Force $env:USERPROFILE\.githooks
@'
#!/bin/bash
echo "Running AI code review..."
node "$HOME\ai-code-review\ai-review.js"
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


✅ This installs the hook globally, so it runs on every Git repository.

5️⃣ Test the Setup

Go to any Git repository and stage a change:

git add .


Commit:

git commit -m "Test AI review"


You will see:

--- Running AI code review ---

===== AI Review =====
⚠️ Potential issue detected in src/app.js line 42
=====================
Saved full review to .ai-review.log

AI found potential issues.
Do you want to proceed with the commit? (y/n):


Type y → continue with the commit

Type n → cancel the commit so you can fix issues

6️⃣ Optional Notes

.ai-review.log stores the full AI report for reference.

Works best in Git Bash or Windows Terminal.

Sensitive code is sent to OpenAI — avoid using on secret repositories unless you are comfortable.

✅ Quick Summary

Clone repo

npm install

Set API key (setx OPENAI_API_KEY "sk-...")

Run global hook installation (PowerShell block)

Stage changes & commit → AI reviewer runs

Accept (y) or cancel (n) commit based on AI feedback

