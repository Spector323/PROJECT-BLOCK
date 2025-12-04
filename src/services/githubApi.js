// GitHub API интеграция
const GITHUB_API_BASE = 'https://api.github.com';

export const githubApi = {
  // Поиск репозиториев пользователя
  async searchUserRepos(username, query = '') {
    try {
      const url = query
        ? `${GITHUB_API_BASE}/search/repositories?q=user:${username}+${query}`
        : `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=50`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Не удалось получить репозитории');
      }
      
      const data = await response.json();
      return query ? data.items : data;
    } catch (error) {
      console.error('GitHub API Error:', error);
      throw error;
    }
  },

  // Получение информации о конкретном репозитории
  async getRepo(owner, repo) {
    try {
      const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`);
      
      if (!response.ok) {
        throw new Error('Репозиторий не найден');
      }
      
      return await response.json();
    } catch (error) {
      console.error('GitHub API Error:', error);
      throw error;
    }
  },

  // Получение языков программирования репозитория
  async getRepoLanguages(owner, repo) {
    try {
      const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`);
      
      if (!response.ok) {
        return {};
      }
      
      return await response.json();
    } catch (error) {
      console.error('GitHub API Error:', error);
      return {};
    }
  },

  // Получение contributors
  async getRepoContributors(owner, repo) {
    try {
      const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors?per_page=5`);
      
      if (!response.ok) {
        return [];
      }
      
      return await response.json();
    } catch (error) {
      console.error('GitHub API Error:', error);
      return [];
    }
  },

  // Получение информации о пользователе
  async getUser(username) {
    try {
      const response = await fetch(`${GITHUB_API_BASE}/users/${username}`);
      
      if (!response.ok) {
        throw new Error('Пользователь не найден');
      }
      
      return await response.json();
    } catch (error) {
      console.error('GitHub API Error:', error);
      throw error;
    }
  },

  // Преобразование данных репозитория в формат проекта
  convertRepoToProject(repo, languages = {}) {
    const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
    const languagePercentages = Object.entries(languages).map(([lang, bytes]) => ({
      name: lang,
      percentage: Math.round((bytes / totalBytes) * 100),
    })).sort((a, b) => b.percentage - a.percentage);

    return {
      id: repo.id.toString(),
      title: repo.name,
      description: repo.description || 'Нет описания',
      status: repo.archived ? 'completed' : 'in-progress',
      priority: repo.stargazers_count > 10 ? 'high' : 'medium',
      startDate: new Date(repo.created_at).toISOString().split('T')[0],
      endDate: new Date(repo.updated_at).toISOString().split('T')[0],
      progress: repo.archived ? 100 : 50,
      teamMembers: [],
      githubUrl: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      languages: languagePercentages,
      topics: repo.topics || [],
      isGithubProject: true,
    };
  },
};
