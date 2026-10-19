import { money } from "../catalog";
export default function ProductIntro({ product }) {
  return (
    <>
      <div className="hero-image">
        <img
          src="/assets/panel-00.webp"
          alt="Organic Islet Fruit Tea, presented by Li Hsiao-yen with a jar, dried artichoke slices and a cup of golden tea"
          fetchPriority="high"
        />
      </div>
      <section className="intro" aria-label="Product information">
        <div className="price-line">
          <div>
            <strong>{money(product.price)}</strong>{" "}
            <del>{money(product.compareAtPrice)}</del>
          </div>
          <span>Free Shipping</span>
          <span>7-Day Returns</span>
        </div>
        <p>
          <b className="small-tag">Limited-Time Offer</b> {product.title}.
          Naturally grown Jerusalem artichoke, carefully selected and
          traditionally prepared. Original flavor, with no added colors or
          preservatives. Brew a cup and enjoy its mellow, golden taste.
        </p>
        <div className="trust">
          <span>✓ Cash on delivery</span>
          <span>✓ Store pickup</span>
          <span>✓ Home delivery</span>
        </div>
        <a className="buy-button" href="#order">
          🛒 Buy Now
        </a>
      </section>
    </>
  );
}
