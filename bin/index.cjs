#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");

const projectName = process.argv[2] || "my-electron-app";
const repo = "Safin-Ahmed/create-electron-app"; // <-- your GitHub repo

console.log(`\nScaffolding Electron + React app in ./${projectName} ...\n`);
execSync(`npx degit ${repo}#main ${projectName}`, { stdio: "inherit" });
console.log("\nInstalling dependencies...");
execSync(`cd ${projectName} && npm install`, { stdio: "inherit" });
console.log("\nDone! 🚀");
console.log(`\nTo get started:\n  cd ${projectName}\n  npm run dev\n`);
