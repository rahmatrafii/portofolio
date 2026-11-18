import { useEffect, useRef } from 'react';
import { attachCloudMotion } from '../lib/cloudMotion.js';
import { attachPaperPlaneRoute } from '../lib/paperPlaneRoute.js';

export default function PaperPlane({ stageRef, active }) {
  const sky = useRef(null);
  const flight = useRef(null);

  useEffect(() => {
    if (!active) return;
    const releaseRoute = attachPaperPlaneRoute({ sky: sky.current, plane: flight.current });
    const releaseMotion = attachCloudMotion({ hero: stageRef.current, background: sky.current });
    return () => { releaseMotion(); releaseRoute(); };
  }, [active, stageRef]);

  return (
    <div className="projects-plane-sky" ref={sky} aria-hidden="true">
      <span className="paper-plane-flight" ref={flight}>
        <svg className="projects-paper-plane" viewBox="0 0 80 64" fill="none" focusable="false">
          <g stroke="#7599b1" strokeWidth="1.2" strokeLinejoin="round">
            <path d="M5 9 76 32 5 55 18 32Z" fill="#f9fdff" />
            <path d="M18 32h58L5 55Z" fill="#d6e8f4" />
            <path d="m18 32-7 13 65-13" fill="#bcd5e7" />
          </g>
        </svg>
      </span>
    </div>
  );
}
