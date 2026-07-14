export type ProjectStatus = '성공' | '성장 중' | '실험 중' | '종료';

export interface Project {
  slug: string;
  name: string;
  description: string;
  year: number;
  durationDays: number;
  aiTools: string[];
  marketingCost: number;
  revenue: number;
  status: ProjectStatus;
  accent: string;
  url: string;
  lesson: string;
}

export const projects: Project[] = [
  {
    slug: 'focus-flow',
    name: 'Focus Flow',
    description: '하루의 집중 시간을 가볍게 설계하고 기록하는 웹 앱',
    year: 2026,
    durationDays: 18,
    aiTools: ['Codex', 'Claude', 'Midjourney'],
    marketingCost: 320000,
    revenue: 1180000,
    status: '성공',
    accent: '#86a7ff',
    url: '#',
    lesson: '작은 문제라도 매일 반복되는 불편을 해결하면 유료 전환이 생긴다.'
  },
  {
    slug: 'insight-board',
    name: 'Insight Board',
    description: '흩어진 고객 피드백을 한눈에 정리하는 인사이트 보드',
    year: 2026,
    durationDays: 24,
    aiTools: ['Codex', 'ChatGPT'],
    marketingCost: 540000,
    revenue: 840000,
    status: '성장 중',
    accent: '#f7a765',
    url: '#',
    lesson: '첫 고객과의 대화를 제품보다 먼저 시작했을 때 방향이 빨리 잡혔다.'
  },
  {
    slug: 'simple-sell',
    name: 'Simple Sell',
    description: '1인 창작자를 위한 초간단 디지털 파일 판매 페이지',
    year: 2025,
    durationDays: 21,
    aiTools: ['Codex', 'Figma AI'],
    marketingCost: 280000,
    revenue: 0,
    status: '종료',
    accent: '#ff8c78',
    url: '#',
    lesson: '기능보다 결제할 고객을 먼저 찾았어야 했다.'
  },
  {
    slug: 'nomad-kit',
    name: 'Nomad Kit',
    description: '해외에서 혼자 일하는 사람을 위한 업무 체크리스트',
    year: 2025,
    durationDays: 12,
    aiTools: ['ChatGPT', 'Canva AI'],
    marketingCost: 90000,
    revenue: 420000,
    status: '성공',
    accent: '#7fc7ac',
    url: '#',
    lesson: '내가 직접 겪는 문제를 해결할 때 콘텐츠도 자연스럽게 나온다.'
  }
];

export const posts = [
  {
    slug: 'from-idea-to-first-payment',
    title: '아이디어에서 첫 결제까지, 18일의 기록',
    excerpt: '완벽한 제품 대신 결제가 가능한 가장 작은 제품을 만든 과정.',
    date: '2026.06.12',
    category: '빌드 로그',
    readTime: '6분'
  },
  {
    slug: 'ai-tools-for-solo-makers',
    title: '혼자 만드는 사람에게 진짜 도움이 된 AI 도구',
    excerpt: '기획, 개발, 디자인, 마케팅에서 실제 시간을 줄여준 도구들.',
    date: '2026.05.28',
    category: 'AI 워크플로',
    readTime: '8분'
  },
  {
    slug: 'why-i-share-failures',
    title: '실패한 프로젝트도 공개하는 이유',
    excerpt: '매출이 없었던 실험에서 다음 프로젝트의 기준을 발견했다.',
    date: '2026.05.04',
    category: '회고',
    readTime: '5분'
  }
];

export const messages = [
  { name: '민지', text: '과정을 숫자로 공개해주셔서 저도 다시 시작할 용기가 생겼어요.' },
  { name: '준호', text: '성공뿐 아니라 실패도 기록하는 방식이 정말 솔직하고 좋습니다.' },
  { name: '서연', text: '언젠가 하와이에서 다음 프로젝트를 출시하는 날을 응원할게요!' }
];

const finished = projects.filter((project) => project.status === '성공' || project.status === '종료');
const successful = finished.filter((project) => project.status === '성공').length;

export const metrics = {
  projectCount: projects.length,
  averageDays: Math.round(projects.reduce((sum, project) => sum + project.durationDays, 0) / projects.length),
  aiToolCount: new Set(projects.flatMap((project) => project.aiTools)).size,
  marketingCost: projects.reduce((sum, project) => sum + project.marketingCost, 0),
  revenue: projects.reduce((sum, project) => sum + project.revenue, 0),
  successRate: Math.round((successful / finished.length) * 100),
  failureRate: Math.round(((finished.length - successful) / finished.length) * 100)
};

export const formatWon = (value: number) => `₩${new Intl.NumberFormat('ko-KR').format(value)}`;
