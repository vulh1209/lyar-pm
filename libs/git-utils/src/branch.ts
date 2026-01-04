import { spawn } from "child_process";

/**
 * Execute a git command and return stdout
 */
async function execGit(
  args: string[],
  cwd: string
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const proc = spawn("git", args, { cwd });
    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
      } else {
        reject(new Error(`Git command failed: ${stderr}`));
      }
    });
  });
}

/**
 * Get current branch name
 */
export async function getCurrentBranch(repoPath: string): Promise<string> {
  const { stdout } = await execGit(["branch", "--show-current"], repoPath);
  return stdout;
}

/**
 * Check if a branch exists
 */
export async function branchExists(
  repoPath: string,
  branchName: string
): Promise<boolean> {
  try {
    await execGit(["rev-parse", "--verify", branchName], repoPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate a safe branch name from a feature title
 */
export function generateBranchName(title: string, featureId: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);

  return `feature/${featureId}-${slug}`;
}

/**
 * Delete a branch (local only)
 */
export async function deleteBranch(
  repoPath: string,
  branchName: string
): Promise<void> {
  await execGit(["branch", "-D", branchName], repoPath);
}
