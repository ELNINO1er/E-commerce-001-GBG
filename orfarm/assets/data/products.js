/* ============================================================================
   SCMC — Catalogue produits (source unique)
   ----------------------------------------------------------------------------
   ⚠️  À COMPLÉTER PAR SCMC AVANT PRODUCTION :
   Aucune donnée n'est inventée. Renseignez ici prix, stock, variantes réelles.
   - price:null            → « Prix sur demande »
   - status:'coming-soon'  → « Bientôt disponible »
   - image 'placeholder'   → photo à venir
   ========================================================================== */
window.SCMC_DATA = (function () {
  "use strict";
  var IMG = "assets/img/produits/";

  var contact = {
    company: "Sustainable Commodities Marketing Company",
    shortName: "SCMC",
    address: "II Plateaux, Carrefour Macaci, Abidjan, Côte d'Ivoire",
    email: "infos@gbg-ci.com",
    phones: ["+225 05 44 20 27 67", "+225 07 10 41 06 05"],
    orderPhone: "+225 07 08 56 56 25",
    whatsapp: "2250708565625",
    whatsappUrl: "https://wa.me/2250708565625"
  };

  var categories = [
    { id: "poudres", name: "Poudres de cacao" },
    { id: "beurres", name: "Beurres de cacao" },
    { id: "masses", name: "Masses et pâtes de cacao" },
    { id: "boissons", name: "Boissons au cacao" },
    { id: "infusions", name: "Infusions" }
  ];

  var brands = [
    { id: "lor-brun", name: "L'Or Brun" },
    { id: "yua", name: "YUA" },
    { id: "sustainable", name: "Sustainable Chocolate" }
  ];

  /* Produits. « variants » = formats réels (250 g / 500 g / 1 kg…).
     price:null tant que SCMC ne communique pas de tarif public. */
  var products = [
    {
      id: "poudre-cacao-lor-brun",
      name: "Poudre de cacao L'Or Brun",
      brand: "lor-brun", category: "poudres",
      desc: "Poudre de cacao 100 % naturelle, idéale pour la pâtisserie, les boissons chaudes et les préparations gourmandes.",
      attributes: ["100 % naturelle", "Traçable", "Sans additif"],
      image: IMG + "poudre-250.jpg",
      gallery: [IMG + "poudre-250.jpg", IMG + "poudre-250-b.jpg", IMG + "poudre-lot.jpg"],
      variants: [ { label: "250 g", price: null }, { label: "500 g", price: null, status: "coming-soon" } ],
      audience: ["b2c", "b2b"], status: "available", featured: true
    },
    {
      id: "beurre-cacao-lor-brun",
      name: "Beurre de cacao L'Or Brun",
      brand: "lor-brun", category: "beurres",
      desc: "Beurre de cacao pur, destiné à la cosmétique et à la chocolaterie. Apprécié pour ses qualités nourrissantes.",
      attributes: ["Pur & premium", "Cosmétique & chocolaterie", "Filières durables"],
      image: IMG + "beurre-250.jpg",
      gallery: [IMG + "beurre-250.jpg", IMG + "beurre-250-b.jpg"],
      variants: [ { label: "250 g", price: null }, { label: "500 g", price: null, status: "coming-soon" } ],
      audience: ["b2c", "b2b"], status: "available", featured: true
    },
    {
      id: "masse-cacao-lor-brun",
      name: "Masse de cacao L'Or Brun",
      brand: "lor-brun", category: "masses",
      desc: "Masse de cacao 100 % pure et naturelle, pour les professionnels et les amateurs de chocolat artisanal.",
      attributes: ["100 % pure", "Naturelle", "Chocolat artisanal"],
      image: IMG + "masse-1kg.jpg",
      gallery: [IMG + "masse-1kg.jpg", IMG + "masse-1kg-b.jpg"],
      variants: [ { label: "1 kg", price: null } ],
      audience: ["b2c", "b2b"], status: "available", featured: true
    },
    {
      id: "jus-cacao-lor-brun",
      name: "Jus de cacao L'Or Brun",
      brand: "lor-brun", category: "boissons",
      desc: "Boisson naturelle extraite de la pulpe de cacao, riche en nutriments et en énergie naturelle.",
      attributes: ["Naturel", "Énergisant", "Pulpe de cacao"],
      image: IMG + "jus-250.jpg",
      gallery: [IMG + "jus-250.jpg", IMG + "jus-250-b.jpg"],
      variants: [ { label: "250 ml", price: null } ],
      audience: ["b2c"], status: "available", featured: true
    },
    {
      id: "infusion-cacao-lor-brun",
      name: "Infusion de cacao L'Or Brun",
      brand: "lor-brun", category: "infusions",
      desc: "Infusion 100 % coques de fèves de cacao torréfiées. Plaisir et bien-être au naturel.",
      attributes: ["100 % naturel", "Coques torréfiées", "Sans additif"],
      image: IMG + "infusion-75.jpg",
      gallery: [IMG + "infusion-75.jpg"],
      variants: [ { label: "75 g (15 × 5 g)", price: null } ],
      audience: ["b2c"], status: "available", featured: true
    },
    {
      id: "poudre-cacao-yua",
      name: "Poudre de cacao YUA",
      brand: "yua", category: "poudres",
      desc: "Poudre de cacao de la gamme YUA. Description détaillée à confirmer par SCMC.",
      attributes: [],
      image: IMG + "placeholder.jpg", gallery: [],
      variants: [ { label: "1 kg", price: null } ],
      audience: ["b2c", "b2b"], status: "coming-soon"
    },
    {
      id: "beurre-cacao-yua",
      name: "Beurre de cacao YUA",
      brand: "yua", category: "beurres",
      desc: "Beurre de cacao de la gamme YUA. Description détaillée à confirmer par SCMC.",
      attributes: [],
      image: IMG + "placeholder.jpg", gallery: [],
      variants: [ { label: "250 g", price: null } ],
      audience: ["b2c", "b2b"], status: "coming-soon"
    },
    {
      id: "poudre-cacao-pro",
      name: "Poudre de cacao L'Or Brun — Format professionnel",
      brand: "lor-brun", category: "poudres",
      desc: "Poudre de cacao en conditionnement professionnel, destinée aux industriels, chocolatiers et transformateurs.",
      attributes: ["Format pro", "Traçable"],
      image: IMG + "placeholder.jpg", gallery: [],
      variants: [ { label: "25 kg", price: null } ],
      audience: ["b2b"], status: "coming-soon"
    },
    {
      id: "chocolat-poudre-sustainable",
      name: "Chocolat en poudre Sustainable",
      brand: "sustainable", category: "poudres",
      desc: "Chocolat en poudre de la gamme Sustainable Chocolate.",
      attributes: [],
      image: IMG + "placeholder.jpg", gallery: [],
      variants: [ { label: "20 g", price: null } ],
      audience: ["b2c"], status: "coming-soon"
    },
    {
      id: "poudre-cacao-sustainable",
      name: "Poudre de cacao Sustainable",
      brand: "sustainable", category: "poudres",
      // Mention « 52 % » présente sur le produit : À CONFIRMER par SCMC
      desc: "Poudre de cacao de la gamme Sustainable Chocolate (teneur 52 % — à confirmer).",
      attributes: [],
      image: IMG + "placeholder.jpg", gallery: [],
      variants: [ { label: "500 g", price: null } ],
      audience: ["b2c", "b2b"], status: "coming-soon"
    }
  ];

  return { contact: contact, categories: categories, brands: brands, products: products };
})();
