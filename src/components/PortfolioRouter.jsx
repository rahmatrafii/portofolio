import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import App from '../App.jsx';
import ProjectPage from './ProjectPage.jsx';
import { resolveProjectRoute } from '../data/projects.js';
import { attachProjectNavigation } from '../lib/projectNavigation.js';

export default function PortfolioRouter() {
  const [view, setView] = useState(() => {
    const route = resolveProjectRoute(typeof window === 'undefined' ? '/' : window.location.pathname);
    return { route, homeMounted: route.type === 'home', showHome: route.type === 'home' };
  });
  const home = useRef(null);
  const page = useRef(null);
  const navigation = useRef({});

  useEffect(() => attachProjectNavigation({
    render(next) { flushSync(() => setView(next)); },
    home: () => home.current,
    page: () => page.current,
    navigation: navigation.current,
  }), []);

  const pageRoute = view.incoming ?? view.route;

  return (
    <>
      {view.homeMounted && <div className="route-home" ref={home} hidden={!view.showHome}
        inert={!view.showHome || Boolean(view.returning)} data-restoring={view.returning || undefined}>
        <App active={view.showHome} navigationRef={navigation} restoredFolder={view.restoredFolder} />
      </div>}
      {pageRoute.type !== 'home' && <div className="route-page" ref={page}
        data-incoming={Boolean(view.incoming) || undefined}
        data-outgoing={view.returning || undefined} inert={Boolean(view.returning || view.incoming)}>
        <div className="route-page-inner" style={view.returning ? { transform: `translateY(-${view.outgoingScroll}px)` } : undefined}>
          <ProjectPage route={pageRoute} active={!view.incoming} />
        </div>
      </div>}
    </>
  );
}
