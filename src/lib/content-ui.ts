export const projectStatusLabels: Record<string, string> = {
  experimenting: '실험 중',
  validating: '수요 검증',
  growing: '성장 중',
  successful: '성공',
  closed: '종료'
};

const accents = ['#86a7ff', '#f7a765', '#ff8c78', '#7fc7ac', '#b9a4f7'];
const money = new Intl.NumberFormat('ko-KR');

export const slugPath = (section: 'projects' | 'blog', slug: string) =>
  `/${section}/${encodeURIComponent(slug)}`;

export const formatPublicDate = (value?: string | null) => {
  if (!value) return '기록 중';
  return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
    .format(new Date(value))
    .replace(/\. /g, '.')
    .replace(/\.$/, '');
};

const durationDays = (started?: string | null, launched?: string | null) => {
  if (!started || !launched) return 0;
  return Math.max(1, Math.round((new Date(launched).getTime() - new Date(started).getTime()) / 86400000));
};

const element = <K extends keyof HTMLElementTagNameMap>(tag: K, className?: string) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
};

export function createProjectCard(project: any, index: number, featured = false) {
  const article = element('article', `project-card${featured ? ' project-card-featured' : ''}`);
  const href = slugPath('projects', String(project.slug));
  const accent = accents[index % accents.length];
  const visual = element('a', 'project-visual');
  visual.href = href;
  visual.style.setProperty('--accent', accent);

  const windowBar = element('div', 'mini-window');
  windowBar.append(element('span'), element('span'), element('span'));
  const visualGrid = element('div', 'visual-grid');
  const projectIndex = element('span', 'project-index');
  projectIndex.textContent = String(index + 1).padStart(2, '0');
  const visualName = element('strong');
  visualName.textContent = project.name;
  const visualMeta = element('small');
  visualMeta.textContent = `${new Date(project.created_at || Date.now()).getFullYear()} DIGITAL PRODUCT`;
  visual.append(windowBar, visualGrid, projectIndex, visualName, visualMeta);

  const body = element('div', 'project-card-body');
  const titleRow = element('div', 'project-title-row');
  const titleCopy = element('div');
  const statusLabel = projectStatusLabels[project.status] || '기록 중';
  const status = element('span', `status status-${statusLabel.replaceAll(' ', '-')}`);
  status.textContent = statusLabel;
  const heading = element('h3');
  const titleLink = element('a');
  titleLink.href = href;
  titleLink.textContent = project.name;
  heading.append(titleLink);
  titleCopy.append(status, heading);
  const roundLink = element('a', 'round-link');
  roundLink.href = href;
  roundLink.ariaLabel = `${project.name} 자세히 보기`;
  roundLink.textContent = '↗';
  titleRow.append(titleCopy, roundLink);

  const summary = element('p');
  summary.textContent = project.summary || project.description || '프로젝트 기록을 정리하고 있습니다.';
  const facts = element('div', 'project-facts');
  const aiCount = project.project_ai_tools?.length || 0;
  [
    `${durationDays(project.started_at, project.launched_at) || '-'}일`,
    `${aiCount} AI`,
    `₩${money.format(Number(project.marketing_cost || 0))} 마케팅`
  ].forEach((value) => {
    const fact = element('span');
    const [first, ...rest] = value.split(' ');
    const bold = element('b');
    bold.textContent = first;
    fact.append(bold, document.createTextNode(rest.length ? ` ${rest.join(' ')}` : ''));
    facts.append(fact);
  });
  body.append(titleRow, summary, facts);
  article.append(visual, body);
  return article;
}

export function createPostRow(post: any, index: number) {
  const link = element('a', 'post-row');
  link.href = slugPath('blog', String(post.slug));
  const number = element('span', 'post-number');
  number.textContent = String(index + 1).padStart(2, '0');
  const copy = element('div');
  const meta = element('small');
  meta.textContent = `BUILD JOURNAL · ${formatPublicDate(post.published_at || post.created_at)}`;
  const heading = element('h3');
  heading.textContent = post.title;
  copy.append(meta, heading);
  const excerpt = element('p');
  excerpt.textContent = post.excerpt || '제작 과정에서 배운 내용을 기록했습니다.';
  const arrow = element('span', 'round-link');
  arrow.textContent = '↗';
  link.append(number, copy, excerpt, arrow);
  return link;
}

