const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://tpnrdfgfkzbpsmilynku.supabase.co';
const supabasePublishableKey =
  import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_xZhBsTUnc15QDNpf_uXvpw_1TmW8l7D';

const projectSelect = [
  'id',
  'slug',
  'name',
  'summary',
  'description',
  'status',
  'revenue',
  'marketing_cost',
  'started_at',
  'launched_at',
  'created_at',
  'website_url',
  'cover_image_url',
  'lesson',
  'project_ai_tools(ai_tools(name))'
].join(',');

const projectCacheKey = (slug: string) => `jae-studio:project:${slug}`;

async function publicRest<T>(table: string, params: URLSearchParams, timeoutMs = 5000): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${params}`, {
      headers: {
        apikey: supabasePublishableKey,
        Authorization: `Bearer ${supabasePublishableKey}`
      },
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`Public data request failed: ${response.status}`);
    return await response.json() as T;
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function fetchPublicProjects(slug?: string) {
  const params = new URLSearchParams({
    select: projectSelect,
    is_public: 'eq.true',
    order: 'created_at.desc'
  });
  if (slug) params.set('slug', `eq.${slug}`);
  return publicRest<any[]>('projects', params);
}

export function cacheProject(project: any) {
  if (!project?.slug) return;
  try {
    sessionStorage.setItem(projectCacheKey(project.slug), JSON.stringify(project));
  } catch {
    // Storage can be unavailable in privacy modes; live fetching still works.
  }
}

export function readCachedProject(slug: string) {
  try {
    const value = sessionStorage.getItem(projectCacheKey(slug));
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}
