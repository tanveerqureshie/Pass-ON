/**
 * Pass ON Store — our own online shopping catalogue.
 *
 * NOTE (integration point): products are static demo data. When the backend
 * is ready, replace this file's contents with data fetched from the
 * `store_products` Supabase table (same shape as StoreProduct) and swap the
 * static arrays for hooks in each page.
 */

export interface StoreProduct {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  brand: string;
  short: string;
  description: string;
  price: number;
  mrp: number;
  image: string;
  badges: Array<'featured' | 'new' | 'bestseller' | 'sale'>;
  stock: number;
  rating: number;
  ratingCount: number;
  highlights: string[];
}

export interface StoreCategory {
  id: string;
  name: string;
  tagline: string;
}

export const STORE_CATEGORIES: StoreCategory[] = [
  { id: 'books', name: 'Books & Study Material', tagline: 'Novels, reference sets & guides' },
  { id: 'electronics', name: 'Electronics & Accessories', tagline: 'Audio, computing & wearables' },
  { id: 'stationery', name: 'Stationery & Supplies', tagline: 'Notebooks, pens & essentials' },
  { id: 'carry', name: 'Bags & Everyday Carry', tagline: 'Backpacks, bottles & eyewear' },
  { id: 'room', name: 'Hostel & Room Essentials', tagline: 'Lighting, comfort & convenience' },
  { id: 'wardrobe', name: 'Campus Wardrobe', tagline: 'Official Pass ON merch' },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Store catalogue — INTEGRATION POINT
   Currently empty: the official store launches soon. Replace this array with
   data from your backend / commerce API when the store goes live.
------------------------------------------------------------------------------ */
export const STORE_PRODUCTS: StoreProduct[] = [];

const _REMOVED_UNTIL_LAUNCH: StoreProduct[] = [
  {
    id: 'p-novel',
    slug: 'milk-and-honey-special-edition',
    name: 'Milk & Honey — Special Edition',
    categoryId: 'books',
    brand: 'Andrews McMeel',
    short: 'The special-edition hardcover of the global poetry bestseller.',
    description:
      'A beautiful hardcover edition of Rupi Kaur\'s record-breaking collection of poetry and prose. Split into four chapters — the hurting, the loving, the breaking, the healing — it journeys through bitterness to empowerment. Ships from our Delhi campuses.',
    price: 349,
    mrp: 499,
    image: '/store/book-novel.jpg',
    badges: ['featured', 'bestseller'],
    stock: 24,
    rating: 4.8,
    ratingCount: 1873,
    highlights: [
      'Hardcover special edition with foil detailing',
      '208 pages of poetry, prose & illustrations',
      'Perfect light read between semesters',
    ],
  },
  {
    id: 'p-books-pack',
    slug: 'startup-classics-box-set',
    name: 'Startup Classics Box Set — 6 Bestsellers',
    categoryId: 'books',
    brand: 'Multiple',
    short: 'Six essential reads for every builder, in one value bundle.',
    description:
      'A curated bundle of six modern classics — Zero to One, Ego is the Enemy, The Obstacle is the Way, Competing Against Luck, Value Proposition Design and The Startup Owner\'s Manual. Everything an entrepreneurship-minded student needs before plugs and pitches.',
    price: 1299,
    mrp: 2499,
    image: '/store/books-pack.jpg',
    badges: ['featured', 'bestseller'],
    stock: 15,
    rating: 4.9,
    ratingCount: 644,
    highlights: [
      '6 hardcover bestsellers bundled together',
      '48% off individual retail prices',
      'Great gift for placement season',
    ],
  },
  {
    id: 'p-laptop',
    slug: 'explorer-14-ultrabook-open-box',
    name: 'Explorer 14″ Ultrabook — Open Box',
    categoryId: 'electronics',
    brand: 'Explorer',
    short: 'Feather-thin everyday ultrabook, open-box certified.',
    description:
      'A sleek 14-inch ultrabook in open-box condition — checked, cleaned and quality-verified by our technicians. Ideal for coding projects, video lectures and the daily metro commute. Includes original charger and a 6-month Pass ON assurance.',
    price: 38999,
    mrp: 52999,
    image: '/store/laptop.jpg',
    badges: ['featured'],
    stock: 5,
    rating: 4.6,
    ratingCount: 209,
    highlights: [
      'Open-box unit, fully quality-checked',
      '14″ anti-glare display, all-day battery',
      '6-month Pass ON assurance included',
    ],
  },
  {
    id: 'p-headphones-black',
    slug: 'boombass-over-ear-headphones',
    name: 'BoomBass Over-Ear Headphones',
    categoryId: 'electronics',
    brand: 'BoomAudio',
    short: 'Deep-bass wireless cans with 40h battery.',
    description:
      'Lightweight over-ear headphones with punchy bass, cushioned ear cups and an impressive 40-hour battery. Foldable design with hands-free calling — perfect for libraries (low-key profiles) and metro rides alike.',
    price: 1899,
    mrp: 2999,
    image: '/store/headphones-black.jpg',
    badges: ['featured'],
    stock: 32,
    rating: 4.5,
    ratingCount: 1520,
    highlights: [
      '40-hour battery life, USB-C fast charge',
      'Supra-aural cushions for long sessions',
      'Bluetooth 5.2 + built-in mic',
    ],
  },
  {
    id: 'p-headphones-retro',
    slug: 'retrostudio-wired-headphones',
    name: 'RetroStudio Wired Headphones',
    categoryId: 'electronics',
    brand: 'RetroStudio',
    short: 'Studio-look retro headphones with warm sound.',
    description:
      'A tribute to classic studio cans — brushed-aluminium ear cups, tan leather band and a tangle-free fabric cable. Warm, balanced sound signature great for electives like music production or just aesthetic study playlists.',
    price: 1299,
    mrp: 1799,
    image: '/store/headphones-retro.jpg',
    badges: ['featured', 'new'],
    stock: 18,
    rating: 4.7,
    ratingCount: 431,
    highlights: [
      'Metallic ear-cup design with leather band',
      'Fabric-braided 3.5mm cable',
      'No charging, ever — pure plug & play',
    ],
  },
  {
    id: 'p-watch',
    slug: 'minimalist-smartwatch-pure-white',
    name: 'Minimalist Smartwatch — Pure White',
    categoryId: 'electronics',
    brand: 'PureTech',
    short: 'Clean white smartwatch for fitness & notifications.',
    description:
      'A clean, monochrome smartwatch that keeps notifications, step counts and sleep tracking on your wrist without the bulk. Silicone strap, soft-touch finish and a display that stays readable in Delhi sunlight.',
    price: 2499,
    mrp: 3999,
    image: '/store/watch.jpg',
    badges: ['featured'],
    stock: 21,
    rating: 4.4,
    ratingCount: 876,
    highlights: [
      'Calls, texts & app notifications',
      'Heart-rate, steps & sleep tracking',
      '7-day battery on a single charge',
    ],
  },
  {
    id: 'p-sunglasses',
    slug: 'classic-polarised-sunglasses',
    name: 'Classic Polarised Sunglasses',
    categoryId: 'carry',
    brand: 'Northline',
    short: 'Timeless black frames with polarised UV400 lenses.',
    description:
      'Wear the campus classic — glossy black frames, polarised UV400 lenses and steel hinges. Cuts glare during cricket Matches and endless bus rides. Comes with a microfibre pouch.',
    price: 999,
    mrp: 1599,
    image: '/store/sunglasses.jpg',
    badges: ['featured'],
    stock: 40,
    rating: 4.6,
    ratingCount: 605,
    highlights: [
      'Polarised UV400 protection',
      'Glossy black designer frames',
      'Microfibre pouch included',
    ],
  },
  {
    id: 'p-backpack',
    slug: 'campuspro-laptop-backpack',
    name: 'CampusPro 15.6″ Laptop Backpack',
    categoryId: 'carry',
    brand: 'CampusPro',
    short: 'Water-resistant backpack with padded laptop bay.',
    description:
      'Built for Indian campuses — water-resistant fabric, a padded 15.6″ laptop sleeve, a quick-access front pocket and a breathable back panel. Slim silhouette that still fits a full day: laptop, tiffin, charger and a registers file.',
    price: 1499,
    mrp: 2199,
    image: '/store/backpack.jpg',
    badges: ['featured', 'bestseller'],
    stock: 27,
    rating: 4.7,
    ratingCount: 2140,
    highlights: [
      'Water-resistant polyester shell',
      'Padded 15.6″ laptop compartment',
      'Quick-grab front pocket for cards & keys',
    ],
  },
  {
    id: 'p-mouse',
    slug: 'silent-wireless-mouse',
    name: 'Silent Wireless Mouse',
    categoryId: 'electronics',
    brand: 'SwiftLine',
    short: 'Whisper-quiet clicks, plug-and-play nano receiver.',
    description:
      'A compact wireless mouse with near-silent switches — sit through lectures without the click-click. 2.4GHz nano receiver, one AA battery lasting up to 12 months and a contoured shape comfortable for both hands.',
    price: 549,
    mrp: 899,
    image: '/store/mouse.jpg',
    badges: [],
    stock: 55,
    rating: 4.3,
    ratingCount: 980,
    highlights: [
      '90% quieter clicks for shared spaces',
      'Up to 12 months on one battery',
      '1600 DPI adjustable via top button',
    ],
  },
  {
    id: 'p-keyboard',
    slug: 'slim-wired-keyboard-full-size',
    name: 'Slim Wired Keyboard — Full Size',
    categoryId: 'electronics',
    brand: 'SwiftLine',
    short: 'Full-size layout with spill-resistant keys.',
    description:
      'A clean white full-size keyboard with a number pad — the assignment-writing workhorse. Low-profile keys, 1.5m cable and spill-resistant drainage. No drivers, no pairing, just plug in and type.',
    price: 749,
    mrp: 1099,
    image: '/store/keyboard.jpg',
    badges: [],
    stock: 34,
    rating: 4.2,
    ratingCount: 412,
    highlights: [
      'Full-size with dedicated number pad',
      'Spill-resistant key drainage',
      'Plug-and-play USB-A connection',
    ],
  },
  {
    id: 'p-erasers',
    slug: 'dust-free-erasers-pack-of-6',
    name: 'Dust-Free Erasers — Pack of 6',
    categoryId: 'stationery',
    brand: 'Papertrail',
    short: 'Clean, smudge-free erasing for every sketch sheet.',
    description:
      'Six white dust-free erasers that leave desks clean and sheets intact — precise enough for drawing sheets, soft enough for note corrections in ballpoint and gel.',
    price: 99,
    mrp: 149,
    image: '/store/erasers.jpg',
    badges: [],
    stock: 120,
    rating: 4.5,
    ratingCount: 300,
    highlights: [
      'Dust-free, minimal smudging',
      'Safe for drawing sheets & rough books',
      'Six units = full semester supply',
    ],
  },
  {
    id: 'p-notebook',
    slug: 'a4-spiral-notebook-200-pages',
    name: 'A4 Ruled Spiral Notebook — 200 Pages',
    categoryId: 'stationery',
    brand: 'Papertrail',
    short: 'Lay-flat spiral binding, 70 GSM smooth paper.',
    description:
      'The everyday A4 notebook — 200 pages of smooth 70 GSM ruled paper with twin-ring spiral binding that lies flat on any desk. Stiff back cover so you can write during stand-up lectures and metro rides.',
    price: 149,
    mrp: 199,
    image: '/store/notebook.jpg',
    badges: [],
    stock: 88,
    rating: 4.6,
    ratingCount: 540,
    highlights: [
      '200 ruled pages, 70 GSM',
      'Lay-flat twin-ring binding',
      'Sturdy back cover for writing anywhere',
    ],
  },
  {
    id: 'p-pen',
    slug: 'matte-black-gel-pens-pack-of-10',
    name: 'Matte Black Gel Pens — Pack of 10',
    categoryId: 'stationery',
    brand: 'Papertrail',
    short: '0.7mm quick-dry gel ink in a stealth matte body.',
    description:
      'A pack of ten matte-black gel pens with 0.7mm quick-dry ink — smooth lines, no smudges, no "wet ink" pages. Retractable clips keep them pocket-safe.',
    price: 199,
    mrp: 299,
    image: '/store/pen.jpg',
    badges: ['new'],
    stock: 150,
    rating: 4.7,
    ratingCount: 260,
    highlights: [
      'Quick-dry 0.7mm gel ink',
      'Retractable & pocket-clip safe',
      '10 pens per pack',
    ],
  },
  {
    id: 'p-bottle',
    slug: 'everyday-sipper-bottle-1l',
    name: 'Everyday Sipper Bottle — 1L',
    categoryId: 'carry',
    brand: 'Hydrolite',
    short: 'Crystal-clear 1L bottle with a leak-proof screw cap.',
    description:
      'A full-litre, BPA-free bottle that survives lab benches and basketball courts. Wide screw cap, easy-grip ribs and a slim body that drops into any backpack side pocket.',
    price: 449,
    mrp: 649,
    image: '/store/bottle.jpg',
    badges: [],
    stock: 64,
    rating: 4.4,
    ratingCount: 210,
    highlights: [
      '1-litre capacity, BPA-free',
      'Leak-proof wide screw cap',
      'Fits standard bottle pockets',
    ],
  },
  {
    id: 'p-lamp',
    slug: 'eye-care-study-lamp',
    name: 'Eye-Care Metal Study Lamp',
    categoryId: 'room',
    brand: 'Hearthome',
    short: 'Focused, flicker-free light for late-night deadlines.',
    description:
      'A sturdy metal study lamp with a wide shade that floods your desk in warm, flicker-free light. Flexible gooseneck neck, heavy base and a warm setting that won\'t wake the entire hostel room.',
    price: 799,
    mrp: 1199,
    image: '/store/lamp.jpg',
    badges: ['featured', 'new'],
    stock: 19,
    rating: 4.6,
    ratingCount: 350,
    highlights: [
      'Flicker-free, eye-comfort lighting',
      'Flexible neck with heavy base',
      'Suits hostel desks & bedside reading',
    ],
  },
  {
    id: 'p-hoodie',
    slug: 'pass-on-campus-hoodie-ash',
    name: 'Pass ON Campus Hoodie — Ash Grey',
    categoryId: 'wardrobe',
    brand: 'Pass ON',
    short: 'Heavy fleece unisex hoodie in campus ash.',
    description:
      'Our official fleece hoodie in a versatile ash grey — 320 GSM heavy fleece, double-stitched hood and kangaroo pocket. Screen-printed with a minimal Pass ON monogram on the chest; survives every wash.',
    price: 999,
    mrp: 1499,
    image: '/store/hoodie.jpg',
    badges: ['featured', 'bestseller'],
    stock: 23,
    rating: 4.8,
    ratingCount: 720,
    highlights: [
      '320 GSM heavy fleece, unisex fit',
      'Double-stitched hood & kangaroo pocket',
      'Minimal Pass ON monogram print',
    ],
  },
  {
    id: 'p-tshirt',
    slug: 'pass-on-campus-tee-white',
    name: 'Pass ON Campus Tee — White',
    categoryId: 'wardrobe',
    brand: 'Pass ON',
    short: 'Organic-cotton regular-fit tee in clean white.',
    description:
      'A crisp white regular-fit T-shirt in breathable organic cotton. Pre-shrunk with a small Pass ON wordmark at the chest — the unofficial uniform for workshop days and hack nights.',
    price: 499,
    mrp: 699,
    image: '/store/tshirt.jpg',
    badges: [],
    stock: 47,
    rating: 4.5,
    ratingCount: 388,
    highlights: [
      '100% organic cotton, pre-shrunk',
      'Regular unisex fit, sizes S–XXL',
      'Small chest wordmark detail',
    ],
  },
];

export function getStoreProduct(id: string) {
  return STORE_PRODUCTS.find((p) => p.id === id);
}

export function discountPercent(p: StoreProduct) {
  return Math.round(((p.mrp - p.price) / p.mrp) * 100);
}

export function formatINR(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}
