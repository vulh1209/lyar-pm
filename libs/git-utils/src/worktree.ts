import { spawn } from "child_process";

export interface WorktreeInfo {
  path: string;
  branch: string;
  commit: string;
}

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
 * Create a new worktree for a feature
 */
export async function createWorktree(
  repoPath: string,
  worktreePath: string,
  branchName: string
): Promise<void> {
  await execGit(["worktree", "add", "-b", branchName, worktreePath], repoPath);
}

/**
 * Remove a worktree
 */
export async function removeWorktree(
  repoPath: string,
  worktreePath: string
): Promise<void> {
  await execGit(["worktree", "remove", worktreePath, "--force"], repoPath);
}

/**
 * List all worktrees in a repository
 */
export async function listWorktrees(repoPath: string): Promise<WorktreeInfo[]> {
  const { stdout } = await execGit(
    ["worktree", "list", "--porcelain"],
    repoPath
  );

  const worktrees: WorktreeInfo[] = [];
  const lines = stdout.split("\n");

  let current: Partial<WorktreeInfo> = {};
  for (const line of lines) {
    if (line.startsWith("worktree ")) {
      current.path = line.slice(9);
    } else if (line.startsWith("HEAD ")) {
      current.commit = line.slice(5);
    } else if (line.startsWith("branch ")) {
      current.branch = line.slice(7).replace("refs/heads/", "");
    } else if (line === "") {
      if (current.path && current.branch && current.commit) {
        worktrees.push(current as WorktreeInfo);
      }
      current = {};
    }
  }

  return worktrees;
}

/**
 * Check if a path is inside a git repository
 */
export async function isGitRepo(path: string): Promise<boolean> {
  try {
    await execGit(["rev-parse", "--git-dir"], path);
    return true;
  } catch {
    return false;
  }
}
