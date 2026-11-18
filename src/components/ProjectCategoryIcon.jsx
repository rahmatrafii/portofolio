export default function ProjectCategoryIcon({ category }) {
  return (
    <svg viewBox="0 0 32 32" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {category === 'web-app' ? <>
        <rect x="4" y="6" width="24" height="20" rx="3" /><path d="M4 12h24" />
        <path d="M8 9h.01M11 9h.01M13 16l-3 3 3 3m6-6 3 3-3 3" />
      </> : category === 'mobile-app' ? <>
        <rect x="9" y="3" width="14" height="26" rx="3.5" /><path d="M14 6h4m-4 19h4" />
        <path d="m13 16 2 2 4-5" />
      </> : <>
        <path d="m10 9 12 2M10 9l-2 14m14-12 2 12M8 23l16 0M10 9l14 14M22 11 8 23" />
        <circle cx="10" cy="9" r="3" /><circle cx="22" cy="11" r="3" />
        <circle cx="8" cy="23" r="3" /><circle cx="24" cy="23" r="3" />
      </>}
    </svg>
  );
}
