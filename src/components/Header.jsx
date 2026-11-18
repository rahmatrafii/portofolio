import { useEffect, useState } from 'react';
import { attachNavigation } from '../lib/navigation.js';

const items = [
  {
    id: 'home',
    label: 'Home',
    icon: <path d="m3 8.5 7-5.5 7 5.5V17h-5v-5H8v5H3Z" />,
  },
  {
    id: 'about',
    label: 'About',
    icon: <><circle cx="10" cy="6" r="3" /><path d="M4 17v-1a6 6 0 0 1 12 0v1" /></>,
  },
  {
    id: 'journey',
    label: 'Journey',
    icon: <><path d="M4 3v14m0-11h7m-7 8h11" /><circle cx="12" cy="6" r="2" /><circle cx="16" cy="14" r="2" /></>,
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: <path d="M2 6a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" />,
  },
];

export default function Header({ active = true }) {
  const [{ activeId, scrolled }, setNavigation] = useState({ activeId: 'home', scrolled: false });

  useEffect(() => active ? attachNavigation(
    items.map(({ id }) => document.getElementById(id)),
    setNavigation,
  ) : undefined, [active]);

  return (
    <header className="header" data-scrolled={scrolled}>
      <span className="marker pill">
        <span className="marker-dot" aria-hidden="true" />Rahmat Rafi Indrayani
      </span>
      <nav className="navigation pill" aria-label="Main navigation">
        <a className="brand" href="#home" aria-label="Rafi, kembali ke beranda">
          <img src="/icons/rafi-mark.svg" width="32" height="32" alt="" />
        </a>
        <div className="navigation-links">
          <span className="navigation-indicator" aria-hidden="true" style={{ transform: `translateX(${items.findIndex(({ id }) => id === activeId) * 100}%)` }} />
          {items.map(({ id, label, icon }) => (
            <a className="navigation-item" aria-current={activeId === id ? 'location' : undefined} href={`#${id}`} key={id}>
              <svg className="navigation-icon" viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                {icon}
              </svg>
              <span className="navigation-label">{label}</span>
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
