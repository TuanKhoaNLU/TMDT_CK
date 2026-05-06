import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const rootDir = resolve(process.cwd());
const watchRoots = ["src", "public"];
const watchFiles = ["index.html", "package.json", "package-lock.json", "vite.config.js"];
const stateDir = resolve(rootDir, "..", "target");
const stateFile = resolve(stateDir, "frontend-build.hash");

function collectFiles(baseDir, currentDir = baseDir, results = []) {
  if (!existsSync(currentDir)) {
    return results;
  }

  const entries = readdirSync(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name === ".git") {
      continue;
    }
    const fullPath = join(currentDir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(baseDir, fullPath, results);
    } else if (entry.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}

function calculateHash() {
  const hash = createHash("sha256");
  const files = [];

  for (const dir of watchRoots) {
    files.push(...collectFiles(resolve(rootDir, dir)));
  }

  for (const file of watchFiles) {
    const fullPath = resolve(rootDir, file);
    if (existsSync(fullPath)) {
      files.push(fullPath);
    }
  }

  files.sort();

  for (const file of files) {
    const content = readFileSync(file);
    hash.update(relative(rootDir, file));
    hash.update("\n");
    hash.update(content);
    hash.update("\n");
  }

  return hash.digest("hex");
}

const newHash = calculateHash();
const oldHash = existsSync(stateFile) ? readFileSync(stateFile, "utf8").trim() : "";

if (newHash === oldHash && existsSync(resolve(rootDir, "dist", "index.html"))) {
  console.log("Frontend unchanged. Skip vite build.");
  process.exit(0);
}

console.log("Frontend changed. Running vite build...");
const result = spawnSync("npm", ["run", "build"], {
  stdio: "inherit",
  shell: true,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

mkdirSync(stateDir, { recursive: true });
writeFileSync(stateFile, `${newHash}\n`, "utf8");
console.log("Frontend build completed and hash updated.");
