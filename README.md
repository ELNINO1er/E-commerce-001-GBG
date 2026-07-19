# E-commerce-001-GBG — SCMC

Site e-commerce **SCMC** (Sustainable Commodities Marketing Company) — vitrine de produits cacao ivoiriens (marque **L'Or Brun** : poudre, beurre, masse, jus, infusion).

Basé sur le template HTML/CSS/JS **Orfarm**, adapté aux couleurs et contenus SCMC.

## Structure

Le site est **à la racine** (un seul dossier). Ouvrez `index.html` :

- `index.html` — Accueil (Home 4, hero animé)
- `boutique.html`, `produit.html`, `panier.html`, `commande.html` — parcours d'achat
- `professionnels.html` — devis B2B
- `a-propos.html`, `tracabilite.html`, `contact.html`, `faq.html`, `recettes.html`, `livraison.html`
- `mentions-legales.html`, `cgv.html`, `confidentialite.html`
- `assets/` — CSS, JS, images (dont `assets/img/produits/` et `assets/img/scmc-01/` = photos SCMC), données
  - `assets/data/products.js` — **catalogue centralisé** (source unique des produits)
  - `assets/js/scmc-shop.js` — panier (localStorage), filtres, fiche produit, commande WhatsApp
  - `assets/css/scmc-theme.css` — thème cacao/or + animations

Les fichiers `shop-*.html`, `blog*.html`, `about.html`, etc. sont des pages d'origine du template (non utilisées par la navigation SCMC).

## Commande & paiement

- Commande via **WhatsApp** ou **paiement à la livraison**.
- Paiement en ligne (Mobile Money / CinetPay / PayDunya / carte) : **à intégrer** quand les identifiants marchands seront disponibles.

## Lancement en local

Pages HTML statiques. Ouvrez `index.html` dans un navigateur, ou servez le dossier via un serveur web (WAMP, Live Server…).

## Déploiement

Le dépôt est publié dans `public_html` (racine du site). Le site s'affiche directement à la racine du domaine.
