#!/usr/bin/env node
/**
 * AI Code Review CLI (Windows CMD friendly)
 * Reviews staged changes, prints issues, and lets the user decide to proceed.
 */

import { execSync } from "child_process";
import OpenAI from "openai";
import readline from "readline";
import 'dotenv/config';

// === CONFIG ===
const MODEL = process.env.AI_REVIEW_MODEL || "gpt-4.1-mini";
const MAX_TOKENS = 1000;
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.error("ERROR: Missing OpenAI API key.");
    process.exit(1);
}

const openai = new OpenAI({ apiKey });

// === HELPERS ===
function getGitDiff() {
    try {
        return execSync("git diff --cached", { encoding: "utf8" });
    } catch {
        console.error("ERROR: Failed to get git diff");
        process.exit(1);
    }
}

async function reviewDiff(diff) {
    const prompt = `
You are a senior software engineer reviewing a Git diff.
Focus on:
- Logic or correctness issues
- Security or performance problems
- Code smell or maintainability concerns
- Potential bugs or missing edge cases

Do NOT comment on trivial formatting or style.

If you find any issues, summarize them clearly. 
If there are none, say "No issues found."

Git diff:
\`\`\`diff
${diff}
\`\`\`
`;

    const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: MAX_TOKENS,
    });

    return response.choices[0].message.content?.trim() || "";
}

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) =>
        rl.question(query, (ans) => {
            rl.close();
            resolve(ans.trim());
        })
    );
}

// === MAIN ===
(async () => {
    const diff = getGitDiff();
    if (!diff.trim()) {
        console.log("No staged changes to review.");
        process.exit(0);
    }

    console.log("\n--- Running AI code review ---\n");

    try {
        const review = await reviewDiff(diff);

        console.log("===== AI Review =====");
        console.log(review);
        console.log("=====================");

        // If no issues, proceed automatically
        if (/no issues/i.test(review)) {
            console.log("\nNo issues found — proceeding with commit.");
            process.exit(0);
        }

        // Otherwise, ask user what to do
        console.log("\nAI found potential issues.");
        const ans = await askQuestion("Do you want to proceed with the commit? (y/n): ");

        if (ans.toLowerCase() === "y") {
            console.log("Proceeding with commit...");
            process.exit(0);
        } else {
            console.log("Commit canceled. Please fix the issues and try again.");
            process.exit(1);
        }
    } catch (err) {
        console.error("ERROR during AI review:");
        console.error(err.message || err);
        process.exit(1);
    }
})();
