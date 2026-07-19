/* ============================================================================
   SCMC — Moteur boutique / panier (front-end, statique)
   Panier : localStorage. Commande : WhatsApp + paiement à la livraison.
   Paiement en ligne (Mobile Money / carte) : à brancher quand SCMC aura ses
   identifiants (CinetPay / PayDunya / Flutterwave).  Dépend de products.js.
   ========================================================================== */
(function () {
  "use strict";
  if (!window.SCMC_DATA) { return; }
  var D = window.SCMC_DATA, PRODUCTS = D.products, CATS = D.categories, CONTACT = D.contact;

  /* ---------- utilitaires ---------- */
  function byId(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }
  function catName(id) { var c = CATS.filter(function (x) { return x.id === id; })[0]; return c ? c.name : ""; }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"); }
  function qs(k) { return new URLSearchParams(location.search).get(k); }
  function priceLabel(p, variant) {
    var v = variant || (p.variants && p.variants[0]);
    if (p.status === "coming-soon" || (v && v.status === "coming-soon")) return "Bientôt disponible";
    return (v && v.price != null) ? v.price : "Prix sur demande";
  }
  function firstFormat(p) { return p.variants && p.variants[0] ? p.variants[0].label : ""; }

  /* ---------- panier (localStorage) ---------- */
  var KEY = "scmc_cart_v2";
  function read() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function write(items) { localStorage.setItem(KEY, JSON.stringify(items)); syncUI(); }
  function count() { return read().reduce(function (n, i) { return n + i.qty; }, 0); }
  function lineKey(id, variant) { return id + "::" + (variant || ""); }
  function add(id, variant, qty) {
    qty = qty || 1;
    var items = read(), k = lineKey(id, variant);
    var l = items.filter(function (i) { return i.key === k; })[0];
    if (l) { l.qty += qty; } else { items.push({ key: k, id: id, variant: variant, qty: qty }); }
    write(items);
  }
  function remove(k) { write(read().filter(function (i) { return i.key !== k; })); }
  function setQty(k, q) { var items = read(); var l = items.filter(function (i){return i.key===k;})[0]; if (l) { l.qty = Math.max(1, q); write(items); } }
  function clear() { write([]); }

  function syncUI() {
    var n = count();
    document.querySelectorAll(".header__info-cart span, [data-cart-count]").forEach(function (b) { b.textContent = n; });
    renderDrawer(); renderCartPage();
  }

  /* ---------- carte produit (markup template + thème) ---------- */
  function productCard(p) {
    var soon = p.status === "coming-soon";
    var url = "produit.html?id=" + encodeURIComponent(p.id);
    var img2 = (p.gallery && p.gallery[1]) ? p.gallery[1] : p.image;
    var badge = soon ? '<div class="tpproduct__info bage"><span class="bage__hot" style="background:#7a5c3e">Bientôt</span></div>' : "";
    var btn = soon
      ? '<a class="tp-btn-2" href="professionnels.html">Demander un devis</a>'
      : '<a class="tp-btn-2 scmc-add" href="#" data-add="' + esc(p.id) + '">Ajouter au panier</a>';
    var attrs = (p.attributes || []).map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("");
    return '' +
      '<div class="tpproduct p-relative">' +
        '<div class="tpproduct__thumb p-relative text-center">' +
          '<a href="' + url + '"><img src="' + esc(p.image) + '" alt="' + esc(p.name + " " + firstFormat(p)) + '" loading="lazy"></a>' +
          '<a class="tpproduct__thumb-img" href="' + url + '"><img src="' + esc(img2) + '" alt="' + esc(p.name) + '" loading="lazy"></a>' +
          badge +
          '<div class="tpproduct__shopping">' +
            '<a class="tpproduct__shopping-wishlist" href="wishlist.html" title="Favoris"><i class="icon-heart icons"></i></a>' +
            '<a class="tpproduct__shopping-cart" href="' + url + '" title="Voir"><i class="icon-eye"></i></a>' +
          '</div>' +
        '</div>' +
        '<div class="tpproduct__content">' +
          '<span class="tpproduct__content-weight"><a href="' + url + '">' + esc(catName(p.category)) + " · " + esc(firstFormat(p)) + '</a></span>' +
          '<h4 class="tpproduct__title"><a href="' + url + '">' + esc(p.name) + '</a></h4>' +
          '<div class="tpproduct__price"><span>' + esc(priceLabel(p)) + '</span></div>' +
        '</div>' +
        '<div class="tpproduct__hover-text">' +
          '<div class="tpproduct__hover-btn d-flex justify-content-center mb-10">' + btn + '</div>' +
          '<div class="tpproduct__descrip"><ul>' + attrs + '</ul></div>' +
        '</div>' +
      '</div>';
  }

  /* ---------- rendu grilles génériques ([data-products="featured|all|category:x|brand:x"]) ---------- */
  function pick(spec) {
    if (!spec || spec === "all") return PRODUCTS.slice();
    if (spec === "featured") return PRODUCTS.filter(function (p) { return p.featured; });
    if (spec.indexOf("category:") === 0) return PRODUCTS.filter(function (p) { return p.category === spec.split(":")[1]; });
    if (spec.indexOf("brand:") === 0) return PRODUCTS.filter(function (p) { return p.brand === spec.split(":")[1]; });
    return PRODUCTS.slice();
  }
  function renderGrids() {
    document.querySelectorAll("[data-products]").forEach(function (host) {
      var list = pick(host.getAttribute("data-products"));
      var col = host.getAttribute("data-col") || "col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-30";
      host.innerHTML = list.map(function (p) { return '<div class="' + col + '">' + productCard(p) + '</div>'; }).join("");
    });
  }

  /* ---------- BOUTIQUE : filtres + recherche + tri ---------- */
  function renderShop() {
    var host = document.querySelector("[data-shop-grid]");
    if (!host) { return; }
    var cat = qs("cat"), q = (qs("q") || "").trim().toLowerCase(), avail = qs("avail"), sort = qs("sort");
    var list = PRODUCTS.slice();
    if (cat) list = list.filter(function (p) { return p.category === cat; });
    if (avail === "in") list = list.filter(function (p) { return p.status !== "coming-soon"; });
    if (avail === "soon") list = list.filter(function (p) { return p.status === "coming-soon"; });
    if (q) list = list.filter(function (p) { return (p.name + " " + p.desc + " " + catName(p.category)).toLowerCase().indexOf(q) > -1; });
    if (sort === "name") list.sort(function (a, b) { return a.name.localeCompare(b.name); });

    var title = document.querySelector("[data-shop-title]");
    if (title) title.textContent = cat ? catName(cat) : (q ? 'Résultats : « ' + q + ' »' : "Tous les produits");
    var cnt = document.querySelector("[data-shop-count]");
    if (cnt) cnt.textContent = list.length + (list.length > 1 ? " produits" : " produit");

    host.innerHTML = list.length
      ? list.map(function (p) { return '<div class="col-lg-4 col-md-6 mb-30">' + productCard(p) + '</div>'; }).join("")
      : '<div class="col-12 text-center pt-40 pb-40"><p>Aucun produit ne correspond.</p><a class="tp-btn" href="boutique.html">Voir tous les produits</a></div>';

    document.querySelectorAll("[data-filter-cat]").forEach(function (a) {
      var v = a.getAttribute("data-filter-cat");
      a.classList.toggle("active", (v === "" && !cat) || v === cat);
    });
  }

  /* ---------- FICHE PRODUIT ---------- */
  function renderProduct() {
    var host = document.querySelector("[data-product-detail]");
    if (!host) { return; }
    var p = byId(qs("id"));
    if (!p) { host.innerHTML = '<div class="text-center pt-50 pb-50"><h2>Produit introuvable</h2><a class="tp-btn mt-20" href="boutique.html">Retour à la boutique</a></div>'; return; }
    document.title = p.name + " — SCMC";
    var bc = document.querySelector("[data-breadcrumb-current]"); if (bc) bc.textContent = p.name;

    var gallery = (p.gallery && p.gallery.length) ? p.gallery : [p.image];
    var thumbs = gallery.map(function (s, i) { return '<button class="scmc-thumb' + (i===0?" is-active":"") + '" data-thumb="' + esc(s) + '"><img src="' + esc(s) + '" alt="' + esc(p.name) + '"></button>'; }).join("");
    var soon = p.status === "coming-soon";
    var variantOpts = (p.variants || []).map(function (v, i) {
      var lbl = v.label + (v.status === "coming-soon" ? " (bientôt)" : "");
      return '<option value="' + esc(v.label) + '"' + (i===0?" selected":"") + '>' + esc(lbl) + '</option>';
    }).join("");
    var attrs = (p.attributes || []).map(function (a) { return '<span class="scmc-tag">' + esc(a) + '</span>'; }).join(" ");
    var action = soon
      ? '<a class="tp-btn" href="professionnels.html">Demander un devis</a>'
      : '<button class="tp-btn scmc-add-detail" data-add="' + esc(p.id) + '">Ajouter au panier</button>';

    host.innerHTML =
      '<div class="row g-5">' +
        '<div class="col-lg-6"><div class="scmc-gallery">' +
          '<div class="scmc-gallery__main"><img data-main src="' + esc(gallery[0]) + '" alt="' + esc(p.name) + '"></div>' +
          (gallery.length > 1 ? '<div class="scmc-gallery__thumbs">' + thumbs + '</div>' : '') +
        '</div></div>' +
        '<div class="col-lg-6"><div class="scmc-pdp">' +
          '<span class="scmc-eyebrow">' + esc(catName(p.category)) + '</span>' +
          '<h1 class="scmc-heading">' + esc(p.name) + '</h1>' +
          '<p class="scmc-pdp__price" data-price>' + esc(priceLabel(p)) + '</p>' +
          '<p>' + esc(p.desc) + '</p>' +
          (attrs ? '<div class="scmc-tags mb-20">' + attrs + '</div>' : '') +
          '<div class="scmc-pdp__buy mt-20">' +
            '<label class="d-block mb-2" style="font-weight:600;color:#2e1a10">Format</label>' +
            '<select data-variant class="scmc-variant">' + variantOpts + '</select>' +
            '<label class="d-block mb-2 mt-3" style="font-weight:600;color:#2e1a10">Quantité</label>' +
            '<input type="number" data-qty value="1" min="1" class="scmc-qty">' +
            '<div class="d-flex flex-wrap gap-2 mt-3">' + action +
              '<a class="scmc-btn-outline" href="' + CONTACT.whatsappUrl + '?text=' + encodeURIComponent("Bonjour SCMC, je souhaite des informations sur : " + p.name) + '" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Poser une question</a>' +
            '</div>' +
          '</div>' +
          '<ul class="scmc-pdp__meta mt-30">' +
            '<li><i class="fal fa-leaf"></i> Cacao ivoirien, transformé localement</li>' +
            '<li><i class="fal fa-search-location"></i> Traçable, de la fève au produit fini</li>' +
            '<li><i class="fal fa-shipping-fast"></i> Commande via WhatsApp ou paiement à la livraison</li>' +
          '</ul>' +
        '</div></div>' +
      '</div>';

    var related = PRODUCTS.filter(function (x) { return x.category === p.category && x.id !== p.id; }).slice(0, 4);
    var rel = document.querySelector("[data-related]");
    if (rel) rel.innerHTML = related.map(function (rp) { return '<div class="col-lg-3 col-md-6 mb-30">' + productCard(rp) + '</div>'; }).join("");
  }

  /* ---------- TIROIR PANIER (header) ---------- */
  function renderDrawer() {
    var host = document.querySelector("[data-cart-drawer]");
    if (!host) { return; }
    var items = read();
    if (!items.length) { host.innerHTML = '<p class="text-center pt-20 pb-20">Votre panier est vide.</p>'; return; }
    host.innerHTML =
      '<div class="tpcart__product-list"><ul>' + items.map(function (i) {
        var p = byId(i.id); if (!p) return "";
        return '<li><div class="tpcart__item"><div class="tpcart__img"><img src="' + esc(p.image) + '" alt="">' +
          '<div class="tpcart__del"><a href="#" data-remove="' + esc(i.key) + '"><i class="icon-x-circle"></i></a></div></div>' +
          '<div class="tpcart__content"><span class="tpcart__content-title"><a href="produit.html?id=' + esc(p.id) + '">' + esc(p.name) + '</a></span>' +
          '<div class="tpcart__cart-price"><span class="quantity">' + i.qty + ' x ' + esc(i.variant || "") + '</span></div></div></div></li>';
      }).join("") + '</ul></div>' +
      '<div class="tpcart__checkout"><div class="tpcart__total-price d-flex justify-content-between align-items-center">' +
      '<span>Total :</span><span class="heilight-price">Prix sur demande</span></div>' +
      '<div class="tpcart__checkout-btn"><a class="tpcart-btn mb-10" href="panier.html">Voir le panier</a>' +
      '<a class="tpcheck-btn" href="commande.html">Commander</a></div></div>';
  }

  /* ---------- PAGE PANIER ---------- */
  function renderCartPage() {
    var host = document.querySelector("[data-cart-page]");
    if (!host) { return; }
    var items = read();
    if (!items.length) { host.innerHTML = '<div class="text-center pt-50 pb-50"><p>Votre panier est vide.</p><a class="tp-btn mt-10" href="boutique.html">Découvrir la boutique</a></div>'; return; }
    host.innerHTML =
      '<div class="table-responsive"><table class="table scmc-cart-table"><thead><tr><th></th><th>Produit</th><th>Format</th><th>Prix</th><th>Quantité</th></tr></thead><tbody>' +
      items.map(function (i) {
        var p = byId(i.id); if (!p) return "";
        return '<tr><td><a href="#" data-remove="' + esc(i.key) + '" aria-label="Retirer">&times;</a></td>' +
          '<td><img src="' + esc(p.image) + '" alt="" style="width:64px;border-radius:8px;margin-right:8px"> ' + esc(p.name) + '</td>' +
          '<td>' + esc(i.variant || "") + '</td>' +
          '<td>' + esc(priceLabel(p)) + '</td>' +
          '<td><input type="number" min="1" value="' + i.qty + '" data-qty-key="' + esc(i.key) + '" style="width:64px"></td></tr>';
      }).join("") +
      '</tbody></table></div>' +
      '<div class="d-flex flex-wrap gap-2 justify-content-between align-items-center mt-30">' +
        '<a class="tp-btn-border" href="#" data-clear>Vider le panier</a>' +
        '<a class="tp-btn" href="commande.html">Passer la commande</a>' +
      '</div>' +
      '<p class="mt-20"><small>Les prix sont communiqués sur demande. Vous finaliserez votre commande via WhatsApp ou en paiement à la livraison.</small></p>';
  }

  /* ---------- TUNNEL DE COMMANDE ---------- */
  function orderText(form) {
    var items = read();
    var lines = items.map(function (i) { var p = byId(i.id); return p ? ("- " + p.name + " (" + (i.variant||"") + ") x" + i.qty) : ""; }).filter(Boolean);
    var d = form ? new FormData(form) : null;
    var head = ["Nouvelle commande — SCMC"];
    if (d) head.push(
      "Nom : " + (d.get("name")||""),
      "Téléphone : " + (d.get("phone")||""),
      "Ville/Commune : " + (d.get("city")||""),
      "Adresse : " + (d.get("address")||""),
      "Livraison : " + (d.get("delivery")||""),
      "Paiement : " + (d.get("payment")||"")
    );
    return head.join("\n") + "\n\nProduits :\n" + lines.join("\n") + "\n\n(Prix à confirmer par SCMC)";
  }
  function initCheckout() {
    var form = document.querySelector("[data-checkout-form]");
    if (!form) { return; }
    var summary = document.querySelector("[data-checkout-summary]");
    if (summary) {
      var items = read();
      summary.innerHTML = items.length
        ? items.map(function (i) { var p = byId(i.id); return p ? '<li class="d-flex justify-content-between"><span>' + esc(p.name) + " · " + esc(i.variant||"") + " ×" + i.qty + '</span><span>Prix sur demande</span></li>' : ""; }).join("")
        : '<li>Votre panier est vide. <a href="boutique.html">Voir la boutique</a></li>';
    }
    var waLink = form.querySelector("[data-wa]");
    if (waLink) waLink.setAttribute("href", CONTACT.whatsappUrl + "?text=" + encodeURIComponent(orderText(null)));
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!read().length) { alert("Votre panier est vide."); return; }
      if (!form.checkValidity()) { form.reportValidity && form.reportValidity(); return; }
      var msg = document.querySelector("[data-checkout-msg]");
      window.open(CONTACT.whatsappUrl + "?text=" + encodeURIComponent(orderText(form)), "_blank", "noopener");
      if (msg) { msg.className = "scmc-form__msg is-success"; msg.textContent = "Merci ! Votre commande a été préparée dans WhatsApp. Un conseiller SCMC confirmera le prix et la livraison. Vous pouvez aussi payer à la livraison."; }
      clear();
    });
  }

  /* ---------- coordonnées dynamiques ---------- */
  function fillContacts() {
    var map = { address: CONTACT.address, email: CONTACT.email, phone1: CONTACT.phones[0], phone2: CONTACT.phones[1], "order-phone": CONTACT.orderPhone };
    document.querySelectorAll("[data-c]").forEach(function (n) { var v = map[n.getAttribute("data-c")]; if (v != null) n.textContent = v; });
    document.querySelectorAll("[data-href]").forEach(function (n) {
      var k = n.getAttribute("data-href");
      if (k === "whatsapp") n.setAttribute("href", CONTACT.whatsappUrl);
      if (k === "email") n.setAttribute("href", "mailto:" + CONTACT.email);
      if (k === "phone1") n.setAttribute("href", "tel:" + CONTACT.phones[0].replace(/\s/g, ""));
      if (k === "order-phone") n.setAttribute("href", "tel:" + CONTACT.orderPhone.replace(/\s/g, ""));
    });
  }

  /* ---------- toast ---------- */
  function toast(t) {
    var e = document.createElement("div"); e.className = "scmc-toast"; e.textContent = t;
    document.body.appendChild(e); requestAnimationFrame(function () { e.classList.add("is-visible"); });
    setTimeout(function () { e.classList.remove("is-visible"); setTimeout(function () { e.remove(); }, 300); }, 2000);
  }

  /* ---------- événements ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-add]");
    if (a) {
      e.preventDefault();
      var id = a.getAttribute("data-add");
      var wrap = a.closest(".scmc-pdp") || document;
      var vsel = wrap.querySelector ? wrap.querySelector("[data-variant]") : null;
      var qsel = wrap.querySelector ? wrap.querySelector("[data-qty]") : null;
      var p = byId(id);
      var variant = vsel ? vsel.value : (p ? firstFormat(p) : "");
      var q = qsel ? (parseInt(qsel.value, 10) || 1) : 1;
      add(id, variant, q); toast("Produit ajouté au panier"); return;
    }
    var rm = e.target.closest("[data-remove]"); if (rm) { e.preventDefault(); remove(rm.getAttribute("data-remove")); return; }
    var cl = e.target.closest("[data-clear]"); if (cl) { e.preventDefault(); clear(); return; }
    var th = e.target.closest("[data-thumb]");
    if (th) { e.preventDefault(); var m = document.querySelector("[data-main]"); if (m) m.src = th.getAttribute("data-thumb");
      document.querySelectorAll(".scmc-thumb").forEach(function (b) { b.classList.remove("is-active"); }); th.classList.add("is-active"); return; }
  });
  document.addEventListener("change", function (e) {
    var q = e.target.closest("[data-qty-key]"); if (q) { setQty(q.getAttribute("data-qty-key"), parseInt(q.value, 10) || 1); }
  });

  function init() { fillContacts(); renderGrids(); renderShop(); renderProduct(); renderCartPage(); initCheckout(); syncUI(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  window.SCMC_CART = { add: add, read: read, count: count, clear: clear };
})();
