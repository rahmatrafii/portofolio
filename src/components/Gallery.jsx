import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { galleryLayers, galleryPhotos } from '../data/gallery.js';
import { attachGallery, galleryPose, galleryScrollSpring, galleryPointerSpring } from '../lib/gallery.js';

function GalleryPhoto({ photo, index, progress, viewport, pointerX, pointerY }) {
  const pose = useTransform([progress, viewport, pointerX, pointerY],
    ([value, size, x, y]) => galleryPose(value, index, galleryLayers.length, size, x, y));
  const transform = useTransform(pose, (value) => value.transform);
  const opacity = useTransform(pose, (value) => value.opacity);
  const pointerEvents = useTransform(pose, (value) => value.pointerEvents);
  return (
    <motion.div className="gallery-photo" style={{ transform, opacity, pointerEvents, zIndex: index + 1 }}>
      <div className="gallery-frame">
        <div className="gallery-image">
          <img src={`/images/gallery/${photo.name}-960.webp`}
            srcSet={`/images/gallery/${photo.name}-480.webp 480w, /images/gallery/${photo.name}-960.webp 960w`}
            sizes="(max-width: 767px) 320px, 490px" alt={index < galleryPhotos.length ? photo.alt : ''}
            style={{ objectPosition: photo.position }}
            width="960" height="1200" loading="lazy" decoding="async" draggable={false} />
        </div>
      </div>
    </motion.div>
  );
}

export default function Gallery({ scroll, active = true }) {
  const root = useRef(null);
  const progress = useMotionValue(0);
  const viewport = useMotionValue({ width: 1440, height: 900 });
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const easedProgress = useSpring(progress, galleryScrollSpring);
  const easedX = useSpring(pointerX, galleryPointerSpring);
  const easedY = useSpring(pointerY, galleryPointerSpring);
  const indicatorOpacity = useTransform(easedProgress, [0, .16], [1, 0]);

  useEffect(() => active ? attachGallery({ root: root.current, scroll, progress, viewport, pointerX, pointerY,
    stop() { easedProgress.stop(); easedX.stop(); easedY.stop(); },
    settle() { easedProgress.jump(progress.get()); easedX.jump(pointerX.get()); easedY.jump(pointerY.get()); },
  }) : undefined, [active, scroll, progress, viewport, pointerX, pointerY, easedProgress, easedX, easedY]);

  return (
    <section className="gallery" id="gallery" aria-labelledby="gallery-heading" ref={root}>
      <div className="gallery-backdrop" aria-hidden="true" />
      <h2 id="gallery-heading" className="sr-only">Galeri kegiatan</h2>
      <div className="gallery-stage">
        <motion.span className="gallery-indicator" aria-hidden="true" style={{ opacity: indicatorOpacity }} />
        <div className="gallery-space">
          {galleryLayers.map((photo, index) => <GalleryPhoto key={index} photo={photo} index={index}
            progress={easedProgress} viewport={viewport} pointerX={easedX} pointerY={easedY} />)}
        </div>
      </div>
    </section>
  );
}
