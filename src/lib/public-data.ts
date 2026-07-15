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
const listCacheKey = (name: string) => `jae-studio:list:${name}`;

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

export async function fetchPublicPosts(limit?: number) {
  const params = new URLSearchParams({
    select: 'id,slug,title,excerpt,cover_image_url,published_at,created_at',
    is_public: 'eq.true',
    published_at: `lte.${new Date().toISOString()}`,
    order: 'published_at.desc'
  });
  if (limit) params.set('limit', String(limit));
  return publicRest<any[]>('blog_posts', params);
}

export async function fetchPublicMessages(limit?: number) {
  const params = new URLSearchParams({
    select: 'id,display_name,message,created_at',
    is_approved: 'eq.true',
    order: 'created_at.desc'
  });
  if (limit) params.set('limit', String(limit));
  return publicRest<any[]>('support_messages', params);
}

export function cacheList(name: string, items: any[]) {
  try {
    sessionStorage.setItem(listCacheKey(name), JSON.stringify(items));
  } catch {
    // Storage can be unavailable in privacy modes; live fetching still works.
  }
}

export function readCachedList(name: string) {
  try {
    const value = sessionStorage.getItem(listCacheKey(name));
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
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
