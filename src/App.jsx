import { useEffect, useState } from "react";
import { fallbackProduct } from "./catalog";
import ProductIntro from "./components/ProductIntro";
import Story from "./components/Story";
import OrderForm from "./components/OrderForm";
export default function App() {
  const [product, setProduct] = useState(fallbackProduct),
    [apiReady, setApiReady] = useState(false);
  useEffect(() => {
    let active = true,
      retryTimer;
    async function connect() {
      try {
        const response = await fetch(
          "/api/products/organic-islet-fruit-tea",
        );
        if (!response.ok) throw Error();
        const nextProduct = await response.json();
        if (!active) return;
        setProduct(nextProduct);
        setApiReady(true);
      } catch {
        if (active) retryTimer = window.setTimeout(connect, 2000);
      }
    }
    connect();
    return () => {
      active = false;
      window.clearTimeout(retryTimer);
    };
  }, []);
  return (
    <>
      <a className="skip-link" href="#order">
        Skip to order
      </a>
      <main className="page">
        <ProductIntro product={product} />
        <Story videos={product.media?.videos || []} />
        <OrderForm product={product} apiReady={apiReady} />
        <footer>
          Copyright © {new Date().getFullYear()} All Rights Reserved
        </footer>
      </main>
      <a className="back-top" href="#" aria-label="Back to top">
        ↑
      </a>
    </>
  );
}
