import panels from "../panels.json";
function Video({ video }) {
  return (
    <figure className="product-video">
      <video controls playsInline preload="metadata" poster={video.poster}>
        <source src={video.src} type="video/mp4" />
        <track
          kind="captions"
          src={video.captions}
          srcLang="en"
          label="English"
          default
        />
      </video>
      <figcaption>{video.title}</figcaption>
    </figure>
  );
}
export default function Story({ videos = [] }) {
  return (
    <section className="story" aria-label="Product story and details">
      <h2 className="section-divider">Product Description</h2>
      <div className="first-story">
        <img
          src="/assets/panel-00.webp"
          alt="7-day returns, product guarantee, sales figures and the farm's entrance"
        />
      </div>
      {panels
        .filter((p) => p.id > 0)
        .map((p) =>
          p.id === 14 ? (
            <div
              key={p.id}
              className="last-story-wrap"
              style={{ aspectRatio: p.width / (p.height * 0.58) }}
            >
              <img
                src={p.src}
                width={p.width}
                height={p.height}
                alt={p.alt}
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : (
            <img
              key={p.id}
              src={p.src}
              width={p.width}
              height={p.height}
              alt={p.alt}
              loading="lazy"
              decoding="async"
            />
          ),
        )}
      {videos.map((v, i) => (
        <Video key={v.src || i} video={v} />
      ))}
    </section>
  );
}
