export default function Portrait({ decorative = false }) {
  return (
    <div className="portrait-depth" aria-hidden={decorative || undefined}>
      <div className="portrait-ground" aria-hidden="true" />
      <div className="portrait-backplate" aria-hidden="true" />
      <div className="portrait-rim" aria-hidden="true" />
      <div className="portrait-image">
        <img
          src="/images/portrait-800.webp"
          srcSet="/images/portrait-500.webp 500w, /images/portrait-800.webp 800w"
          sizes="(max-width: 680px) 250px, (max-width: 1279px) 340px, 397px"
          alt={decorative ? '' : 'Rafi'}
          width="1152"
          height="2244"
          fetchPriority={decorative ? undefined : 'high'}
          loading={decorative ? 'lazy' : undefined}
          decoding="async"
        />
      </div>
    </div>
  );
}
