/**
 * ViTao GitHub Service
 * Interacts directly with GitHub REST API to commit data changes straight to repo branch.
 */

export interface GitHubRepoConfig {
  owner: string;
  repo: string;
  branch: string;
  token?: string;
}

export const DEFAULT_REPO_CONFIG: GitHubRepoConfig = {
  owner: 'namtacozz',
  repo: 'ViTao',
  branch: 'main'
};

// UTF-8 to Base64 encoder for browser
function utf8ToBase64(str: string): string {
  return window.btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(_match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
}

// Base64 to UTF-8 decoder for browser
function base64ToUtf8(str: string): string {
  return decodeURIComponent(
    Array.prototype.map
      .call(window.atob(str), function (c: string) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
}

/**
 * Validate a GitHub Personal Access Token
 */
export async function testGitHubToken(token: string): Promise<{ valid: boolean; username?: string; error?: string }> {
  try {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    if (!res.ok) {
      return { valid: false, error: `GitHub API error: ${res.status} ${res.statusText}` };
    }

    const data = await res.json();
    return { valid: true, username: data.login };
  } catch (err) {
    return { valid: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}

/**
 * Get current file content and SHA from GitHub repo
 */
export async function getGitHubFile(
  path: string,
  config: GitHubRepoConfig
): Promise<{ content: string; sha: string } | null> {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}?ref=${config.branch}`;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json'
  };

  if (config.token) {
    headers.Authorization = `Bearer ${config.token}`;
  }

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch ${path}: ${res.statusText}`);
    }

    const data = await res.json();
    const cleanContent = data.content ? base64ToUtf8(data.content.replace(/\n/g, '')) : '';
    return {
      content: cleanContent,
      sha: data.sha
    };
  } catch (err) {
    console.error(`Error fetching file ${path} from GitHub:`, err);
    return null;
  }
}

/**
 * Commit / update a file directly to the GitHub repo branch
 */
export async function commitFileToGitHub(
  path: string,
  contentStr: string,
  commitMessage: string,
  config: GitHubRepoConfig
): Promise<{ success: boolean; commitSha?: string; error?: string }> {
  if (!config.token) {
    return { success: false, error: 'Chưa cung cấp GitHub Token (PAT)' };
  }

  try {
    // 1. Fetch current file SHA if it exists
    const current = await getGitHubFile(path, config);
    const base64Content = utf8ToBase64(contentStr);

    const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`;
    const bodyPayload: Record<string, string> = {
      message: commitMessage,
      content: base64Content,
      branch: config.branch
    };

    if (current?.sha) {
      bodyPayload.sha = current.sha;
    }

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyPayload)
    });

    if (!res.ok) {
      const errJson = await res.json();
      return { success: false, error: errJson.message || `Lỗi GitHub API: ${res.status}` };
    }

    const resData = await res.json();
    return {
      success: true,
      commitSha: resData.commit?.sha?.substring(0, 7)
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Lỗi kết nối GitHub'
    };
  }
}

/**
 * Fetch public user repositories
 */
export async function fetchUserRepos(username: string) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=12`);
    if (!res.ok) return [];
    const repos = await res.json();
    return repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      url: repo.html_url,
      updatedAt: repo.pushed_at
    }));
  } catch (err) {
    console.error('Error fetching user repos:', err);
    return [];
  }
}
