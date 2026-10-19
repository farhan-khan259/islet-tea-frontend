import { useRef, useState } from "react";
import { money } from "../catalog";
export default function OrderForm({ product, apiReady }) {
  const [selected, setSelected] = useState("six"),
    [delivery, setDelivery] = useState("home"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [receipt, setReceipt] = useState(null);
  const key = useRef(crypto.randomUUID());
  const chosen =
    product.packages.find((p) => p.id === selected) || product.packages[0];
  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!apiReady) {
      setError("Ordering is temporarily unavailable. Please try again later.");
      return;
    }
    setBusy(true);
    const f = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": key.current,
        },
        body: JSON.stringify({
          ...f,
          packageId: chosen.id,
          deliveryMethod: delivery,
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw Error(data.message || "Unable to place order. Please try again.");
      setReceipt(data);
      document.getElementById("order").scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section id="order" className="order-section">
      <h2 className="section-divider">Confirm Your Order</h2>
      {receipt ? (
        <div className="success" role="status">
          <span className="success-icon">✓</span>
          <h3>Thank you for your order!</h3>
          <p>Your order has been received.</p>
          <p>
            Order reference: <strong>{receipt.orderNumber}</strong>
          </p>
          <p>
            {chosen.label}
            <br />
            {money(receipt.total)} · Cash on delivery
          </p>
          <button
            className="buy-button"
            onClick={() => {
              setReceipt(null);
              key.current = crypto.randomUUID();
            }}
          >
            Place Another Order
          </button>
        </div>
      ) : (
        <form onSubmit={submit}>
          <div className="order-product">
            <div className="mini-hero">
              <img src="/assets/panel-00.webp" alt="Tea product" />
            </div>
            <p>
              <b>{product.title}</b>
              <br />
              {product.subtitle}
              <br />
              Choose a package below. Free shipping on all packages.
            </p>
          </div>
          <fieldset className="packages">
            <legend className="sr-only">Choose your package</legend>
            {product.packages.map((p) => (
              <label
                className={"package " + (chosen.id === p.id ? "selected" : "")}
                key={p.id}
              >
                <input
                  type="radio"
                  name="package"
                  value={p.id}
                  checked={chosen.id === p.id}
                  onChange={() => setSelected(p.id)}
                />
                {p.label} – {money(p.price)}
              </label>
            ))}
          </fieldset>
          <div className="total-row">
            <span>Order Total</span>
            <strong>{money(chosen.price)}</strong>
          </div>
          <label className="field-row">
            <span>
              <i>*</i> Full Name
            </span>
            <input
              name="name"
              autoComplete="name"
              maxLength={100}
              required
              placeholder="Enter your full name"
            />
          </label>
          <label className="field-row">
            <span>
              <i>*</i> Mobile
            </span>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={30}
              required
              placeholder="Enter your mobile number"
              pattern="[+0-9() .-]{7,30}"
            />
          </label>
          <fieldset className="delivery">
            <legend>
              <i>*</i> Delivery Method
            </legend>
            {[
              ["home", "🚚 Cash on Delivery"],
              ["seven-eleven", "7-ELEVEN Pickup"],
              ["familymart", "FamilyMart Pickup"],
            ].map(([id, text]) => (
              <label key={id} className={delivery === id ? "active" : ""}>
                <input
                  type="radio"
                  name="delivery"
                  value={id}
                  checked={delivery === id}
                  onChange={() => setDelivery(id)}
                />
                {text}
              </label>
            ))}
          </fieldset>
          <p className="delivery-note">
            {delivery === "home"
              ? "Home delivery by local courier. Add any delivery instructions in the notes below."
              : "Enter the pickup store name, store code and full address. The seller must confirm store availability before dispatch."}
          </p>
          <label className="field-row">
            <span>
              <i>*</i> Country / Region
            </span>
            <input
              name="country"
              autoComplete="country-name"
              required
              maxLength={100}
              placeholder="Enter your country or region"
            />
          </label>
          <label className="field-row">
            <span>
              <i>*</i> City / County
            </span>
            <input
              name="city"
              autoComplete="address-level1"
              required
              maxLength={100}
              placeholder="Enter your city, county, state or province"
            />
          </label>
          <label className="field-row">
            <span>
              <i>*</i> District
            </span>
            <input
              name="district"
              autoComplete="address-level2"
              required
              maxLength={100}
              placeholder="Enter your district"
            />
          </label>
          {delivery !== "home" && (
            <label className="field-row">
              <span>
                <i>*</i> Pickup Store
              </span>
              <input
                name="store"
                required
                maxLength={150}
                placeholder="Store name and store code"
              />
            </label>
          )}
          <label className="field-row">
            <span>
              <i>*</i> {delivery === "home" ? "Full Address" : "Store Address"}
            </span>
            <input
              name="address"
              autoComplete="street-address"
              required
              minLength={5}
              maxLength={300}
              placeholder={
                delivery === "home"
                  ? "Street, building, floor and postal code"
                  : "Enter the full pickup store address"
              }
            />
          </label>
          <label className="field-row">
            <span>Notes</span>
            <textarea
              name="notes"
              maxLength={1000}
              placeholder="Special requests or delivery instructions"
              rows={3}
            />
          </label>
          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="honeypot"
            aria-hidden="true"
          />
          <p className="order-terms">
            Payment is collected on delivery. Your details are used to process
            and deliver this order.
          </p>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="buy-button" type="submit" disabled={busy}>
            {busy ? "Submitting Your Order…" : "Submit Order"}
          </button>
        </form>
      )}
    </section>
  );
}
