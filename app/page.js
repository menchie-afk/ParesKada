"use client";

import { useMemo, useState } from "react";

const dishes = [
  { id: 1, name: "Classic Beef Pares", shop: "Kanto Pares House", price: 99, category: "Pares", tag: "Best seller", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85", desc: "Tender beef, rich savory sauce, and garlic rice." },
  { id: 2, name: "Pares Mami", shop: "Timplang Kanto", price: 119, category: "Mami", tag: "Comfort food", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=85", desc: "Warm noodle soup topped with slow-cooked beef." },
  { id: 3, name: "Beef Tapa Silog", shop: "Almusal Lokal", price: 109, category: "Silog", tag: "Sulit meal", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85", desc: "Sweet-savory beef tapa, egg, and sinangag." },
  { id: 4, name: "Overload Pares", shop: "Pares ni Kuya", price: 149, category: "Pares", tag: "Kada favorite", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85", desc: "Extra beef and toppings for a bigger craving." },
  { id: 5, name: "Pares Bulalo Mami", shop: "Timplang Kanto", price: 139, category: "Mami", tag: "Must try", image: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&w=900&q=85", desc: "A hearty bowl with a deep, comforting broth." },
  { id: 6, name: "Longsilog", shop: "Almusal Lokal", price: 89, category: "Silog", tag: "Budget pick", image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=900&q=85", desc: "Classic Filipino breakfast, ready any time." }
];

const shops = [
  { name: "Kanto Pares House", area: "Local favorite · 0.8 km", rating: "4.9", time: "20–30 min", initials: "KP" },
  { name: "Timplang Kanto", area: "Pares at mami · 1.2 km", rating: "4.8", time: "25–35 min", initials: "TK" },
  { name: "Almusal Lokal", area: "Silog meals · 1.5 km", rating: "4.7", time: "15–25 min", initials: "AL" }
];

const money = (n) => "₱" + n.toFixed(2);

export default function Home() {
  const [category, setCategory] = useState("Lahat");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const filtered = useMemo(() => dishes.filter((dish) =>
    (category === "Lahat" || dish.category === category) &&
    (dish.name + " " + dish.shop).toLowerCase().includes(search.toLowerCase())
  ), [category, search]);

  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  function addToCart(dish) {
    setCart((current) => {
      const found = current.find((item) => item.id === dish.id);
      return found
        ? current.map((item) => item.id === dish.id ? { ...item, qty: item.qty + 1 } : item)
        : [...current, { ...dish, qty: 1 }];
    });
    setNotice(dish.name + " added to your kada bag!");
    window.setTimeout(() => setNotice(""), 2200);
  }

  function changeQty(id, amount) {
    setCart((current) => current
      .map((item) => item.id === id ? { ...item, qty: item.qty + amount } : item)
      .filter((item) => item.qty > 0));
  }

  return (
    <main>
      <div className="topline"><span>🇵🇭 Sarap na swak sa budget, mula sa mga lokal na paresan.</span><span className="top-right">Made for every kada <b>♥</b></span></div>
      <header className="nav wrap">
        <a className="brand" href="#"><span className="brand-mark">PK</span><span>Pares<span className="brand-accent">Kada</span><small>SARAP NG PARES, DITO SA KADA!</small></span></a>
        <nav><a href="#discover">Discover</a><a href="#shops">Mga Paresan</a><a href="#about">About us</a></nav>
        <button className="cart-button" onClick={() => setCartOpen(true)} aria-label="Open cart">♧ <span>Kada Bag</span><b>{count}</b></button>
      </header>

      <section className="hero">
        <div className="hero-inner wrap">
          <div className="hero-copy">
            <div className="eyebrow"><span></span> YOUR LOCAL PARES FINDER</div>
            <h1>May cravings?<br/><em>May paresan.</em></h1>
            <p>Hanap, discover, at supportahan ang mga paborito mong lokal na paresan. Tara, kain na, kada!</p>
            <div className="hero-actions"><a className="primary-btn" href="#discover">Explore the menu <span>↗</span></a><a className="text-btn" href="#shops">Find a paresan <span>→</span></a></div>
            <div className="hero-proof"><div className="avatars"><i>🍜</i><i>🥘</i><i>🍳</i></div><span><b>Local flavors,</b> proudly Pinoy.</span></div>
          </div>
          <div className="hero-art"><div className="hero-photo"><img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=90" alt="A delicious Filipino-inspired meal"/></div><div className="floating-note"><span>✦</span><div><b>Busog goals</b><small>One bowl at a time.</small></div></div><div className="round-stamp">SULIT<br/>SARAP<br/>ULIT!</div></div>
        </div>
        <div className="hero-bottom wrap"><span>01 / MADE FOR YOUR CRAVINGS</span><span>GOOD FOOD. GOOD MOOD. GOOD KADA.</span></div>
      </section>

      <section className="benefits wrap">
        <div><span className="benefit-icon">⌕</span><p><b>Discover local gems</b><small>Find paresan near your area.</small></p></div>
        <div><span className="benefit-icon">♡</span><p><b>Support small businesses</b><small>Celebrate neighborhood flavors.</small></p></div>
        <div><span className="benefit-icon">✦</span><p><b>Find your next favorite</b><small>May bago kang titikman.</small></p></div>
      </section>

      <section className="section wrap" id="discover">
        <div className="section-heading"><div><div className="eyebrow">THE CRAVING STARTS HERE</div><h2>Explore the <em>menu.</em></h2><p>Mga pagkaing sulit balikan, kahit anong oras.</p></div><span className="section-number">01 — 03</span></div>
        <div className="toolbar"><div className="filters">{["Lahat", "Pares", "Mami", "Silog"].map((item) => <button key={item} className={category === item ? "filter active" : "filter"} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="search"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ulam or paresan..." /></label></div>
        <div className="food-grid">{filtered.map((dish) => <article className="food-card" key={dish.id}><div className="food-image"><img src={dish.image} alt={dish.name}/><span className="food-tag">{dish.tag}</span><button className="heart" aria-label={"Save " + dish.name}>♡</button></div><div className="food-info"><div className="food-meta"><span>{dish.category}</span><span>★ 4.9</span></div><h3>{dish.name}</h3><p>{dish.desc}</p><div className="food-bottom"><b>{money(dish.price)}</b><button onClick={() => addToCart(dish)} aria-label={"Add " + dish.name}>＋</button></div><small className="shop-name">⌂ {dish.shop}</small></div></article>)}</div>
        {filtered.length === 0 && <div className="empty">Walang match sa search mo. Try ibang keyword, kada!</div>}
      </section>

      <section className="shops-section" id="shops"><div className="wrap section"><div className="section-heading"><div><div className="eyebrow">MEET YOUR NEIGHBORHOOD FAVORITES</div><h2>Mga <em>paresan</em> sa kada.</h2><p>Bigyan ng love ang mga lokal na kainan sa inyong lugar.</p></div><span className="section-number">02 — 03</span></div><div className="shop-grid">{shops.map((shop) => <article className="shop-card" key={shop.name}><div className="shop-avatar">{shop.initials}</div><div className="shop-detail"><h3>{shop.name}</h3><p>{shop.area}</p><div><span>★ {shop.rating}</span><span>◷ {shop.time}</span></div></div><button aria-label={"View " + shop.name}>↗</button></article>)}</div><p className="demo-note">Sample listings for the website prototype.</p></div></section>

      <section className="join-section wrap" id="about"><div className="join-copy"><div className="eyebrow">PARA SA MGA KA-PARES</div><h2>May paresan ka?<br/><em>Kasali ka dito.</em></h2><p>Palakihin ang reach ng iyong negosyo at ipakilala ang inyong sariling timpla sa mas maraming customers.</p><a href="mailto:hello@pareskada.ph" className="primary-btn">Be part of ParesKada <span>↗</span></a></div><div className="join-art"><span>LOCAL</span><b>LOVE<br/>LANG.</b><small>SUPPORT YOUR<br/>NEIGHBORHOOD EATS</small></div></section>

      <footer><div className="wrap footer-inner"><a className="brand footer-brand" href="#"><span className="brand-mark">PK</span><span>Pares<span className="brand-accent">Kada</span><small>SARAP NG PARES, DITO SA KADA!</small></span></a><p>Made with ♥ for Filipino food and local communities.</p><span>© 2026 ParesKada · Prototype</span></div></footer>

      {notice && <div className="toast">{notice}</div>}
      {cartOpen && <div className="modal-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-panel" onClick={(e) => e.stopPropagation()}><div className="cart-head"><div><span className="eyebrow">YOUR ORDER PREVIEW</span><h2>Kada bag <em>({count})</em></h2></div><button onClick={() => setCartOpen(false)}>×</button></div>{cart.length === 0 ? <div className="empty">Wala pang laman ang kada bag mo. Explore muna tayo!</div> : <>{cart.map((item) => <div className="cart-item" key={item.id}><div><b>{item.name}</b><small>{money(item.price)} each</small></div><div className="qty"><button onClick={() => changeQty(item.id, -1)}>−</button><span>{item.qty}</span><button onClick={() => changeQty(item.id, 1)}>＋</button></div></div>)}<div className="cart-total"><span>Estimated total</span><b>{money(total)}</b></div><p className="demo-note">Prototype only — checkout and actual ordering are not connected yet.</p></>}<button className="primary-btn full" onClick={() => setCartOpen(false)}>Continue exploring <span>→</span></button></aside></div>}
    </main>
  );
}
