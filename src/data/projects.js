export const projectCategories = [
  { slug: 'web-app', label: 'Web Apps', description: 'Proyek yang berfokus pada pengembangan aplikasi web.' },
  { slug: 'mobile-app', label: 'Mobile Apps', description: 'Proyek yang berfokus pada pengalaman aplikasi mobile.' },
  { slug: 'ai-integration', label: 'AI Integration', description: 'Proyek yang berfokus pada penerapan AI ke dalam produk dan alur kerja.' },
];

// Temporary previews requested by Rafi; replace these with real project content.
const previews = {
  'web-app': ['rafniture', 'travel', 'business', 'business'],
  'mobile-app': ['business', 'rafniture', 'travel', 'travel'],
  'ai-integration': ['travel', 'business', 'rafniture', 'rafniture'],
};
// Rafi's selected base stacks with relevant companions for the temporary previews.
const technologyCatalog = {
  nextjs: { name: 'Next.js', icon: '/icons/nextjs.svg' },
  react: { name: 'React', icon: '/icons/react.svg' },
  laravel: { name: 'Laravel', icon: '/icons/laravel.svg' },
  firebase: { name: 'Firebase', icon: '/icons/firebase.svg' },
  flutter: { name: 'Flutter', icon: '/icons/flutter.svg' },
  java: { name: 'Java', icon: '/icons/java.svg' },
  supabase: { name: 'Supabase', icon: '/icons/supabase.svg' },
  gemini: { name: 'Gemini', icon: '/icons/gemini.svg' },
  typescript: { name: 'TypeScript', icon: '/icons/typescript.svg' },
  javascript: { name: 'JavaScript', icon: '/icons/javascript.svg' },
  tailwindcss: { name: 'Tailwind CSS', icon: '/icons/tailwindcss.svg' },
  motion: { name: 'Motion', icon: '/icons/motion.svg' },
  vite: { name: 'Vite', icon: '/icons/vite.svg' },
  php: { name: 'PHP', icon: '/icons/php.svg' },
  dart: { name: 'Dart', icon: '/icons/dart.svg' },
  postgresql: { name: 'PostgreSQL', icon: '/icons/postgresql.svg' },
  sqlite: { name: 'SQLite', icon: '/icons/sqlite.svg' },
  android: { name: 'Android', icon: '/icons/android.svg' },
  nodejs: { name: 'Node.js', icon: '/icons/nodejs.svg' },
};
const previewStacks = {
  'web-app': [
    ['nextjs', 'firebase', 'react', 'typescript', 'tailwindcss', 'motion'],
    ['react', 'firebase', 'javascript', 'vite', 'tailwindcss', 'motion'],
    ['laravel', 'react', 'php', 'typescript', 'tailwindcss', 'vite'],
    ['laravel', 'firebase', 'php', 'javascript', 'tailwindcss', 'vite'],
  ],
  'mobile-app': [
    ['flutter', 'supabase', 'dart', 'postgresql', 'sqlite'],
    ['java', 'supabase', 'android', 'postgresql', 'sqlite'],
    ['flutter', 'supabase', 'dart', 'sqlite', 'postgresql'],
    ['java', 'supabase', 'android', 'sqlite', 'postgresql'],
  ],
  'ai-integration': [
    ['nextjs', 'gemini', 'react', 'typescript', 'tailwindcss', 'nodejs'],
    ['flutter', 'gemini', 'dart', 'firebase', 'sqlite'],
    ['nextjs', 'gemini', 'react', 'typescript', 'firebase', 'motion'],
    ['flutter', 'gemini', 'dart', 'firebase', 'sqlite'],
  ],
};
export const projects = projectCategories.flatMap((category) => previews[category.slug].map((image, index) => ({
  category: category.slug,
  slug: `pratinjau-${index + 1}`,
  title: `Pratinjau ${category.label} ${index + 1}`,
  image: `/images/projects/${image}.webp`,
  temporary: true,
  technologies: previewStacks[category.slug][index].map((name) => technologyCatalog[name]),
  summary: 'Konten sementara menggunakan gambar dari koleksi proyek.',
})));

export function resolveProjectRoute(pathname) {
  const path = pathname.replace(/\/+$/, '');
  if (!path) return { type: 'home' };
  let parts;
  try { parts = path.slice(1).split('/').map(decodeURIComponent); }
  catch { return { type: 'not-found' }; }
  const categorySlug = ['mobile-app-ai', 'web-app-ai'].includes(parts[0]) ? 'ai-integration' : parts[0];
  const category = projectCategories.find(({ slug }) => slug === categorySlug);
  if (!category || parts.length > 2) return { type: 'not-found' };
  if (parts.length === 1) return { type: 'category', category };
  const project = projects.find((item) => item.category === category.slug && item.slug === parts[1]);
  return project ? { type: 'detail', category, project } : { type: 'not-found', category };
}
