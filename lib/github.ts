import { Octokit } from '@octokit/rest';

export class GitHubService {
  private octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken
    });
  }

  async getUserRepos() {
    try {
      const { data } = await this.octokit.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 50
      });
      return data;
    } catch (error) {
      console.error('Error fetching repos:', error);
      throw error;
    }
  }

  async getRepo(owner: string, repo: string) {
    try {
      const { data } = await this.octokit.repos.get({
        owner,
        repo
      });
      return data;
    } catch (error) {
      console.error('Error fetching repo:', error);
      throw error;
    }
  }

  async createPullRequest(owner: string, repo: string, title: string, head: string, base: string, body?: string) {
    try {
      const { data } = await this.octokit.pulls.create({
        owner,
        repo,
        title,
        head,
        base,
        body
      });
      return data;
    } catch (error) {
      console.error('Error creating pull request:', error);
      throw error;
    }
  }

  async getFileContent(owner: string, repo: string, path: string) {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path
      });
      return data;
    } catch (error) {
      console.error('Error fetching file content:', error);
      throw error;
    }
  }

  async updateFile(owner: string, repo: string, path: string, content: string, message: string, sha: string) {
    try {
      const { data } = await this.octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString('base64'),
        sha
      });
      return data;
    } catch (error) {
      console.error('Error updating file:', error);
      throw error;
    }
  }
}
