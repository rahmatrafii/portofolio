import { useEffect } from 'react';
import { attachCloudMotion } from '../lib/cloudMotion.js';

export default function CloudBackground({ heroRef, backgroundRef }) {
  useEffect(() => attachCloudMotion({
    hero: heroRef.current,
    background: backgroundRef.current,
  }), [heroRef, backgroundRef]);

  return (
    <div className="background" ref={backgroundRef} aria-hidden="true">
      <div className="sky-light" />
      <div className="clouds">
        {['far', 'near'].map((layer) => (
          <div className={`cloud-layer cloud-layer-${layer}`} key={layer}>
            <div className="cloud-track">
              {[0, 1].map((tile) => (
                <img
                  src="/images/hero-cloud-bank-2000.webp"
                  srcSet="/images/hero-cloud-bank-1000.webp 1000w, /images/hero-cloud-bank-2000.webp 2000w"
                  sizes="(max-width: 900px) 900px, 100vw"
                  width="2172"
                  height="724"
                  alt=""
                  decoding="async"
                  key={tile}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
