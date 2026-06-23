// Centralised Unsplash imagery (industrial theme) so URLs are easy to swap.
// All hosts are whitelisted in next.config.mjs. Replace any ID you prefer —
// keep the query string for automatic format + sizing.

const U = "https://images.unsplash.com/photo-";
const Q = "?auto=format&fit=crop&q=80";

export const img = {
  heroPrimary: `${U}1504917595217-d4dc5ebe6122${Q}&w=1920`,
  heroSecondary: `${U}1581092160562-40aa08e78837${Q}&w=1200`,
  aboutFactory: `${U}1565793298595-6a879b1d9492${Q}&w=1400`,
  aboutTeam: `${U}1581092918056-0c4c3acd3789${Q}&w=1200`,
  ctaBackground: `${U}1531297484001-80022131f5a1${Q}&w=1920`,
  supportHero: `${U}1454165804606-c3d57bc86b40${Q}&w=1600`,
  contactHero: `${U}1486406146926-c627a92ad1ab${Q}&w=1600`,
};

// Reusable industrial photos for product cards (swap for real WP media later).
export const productImages = [
  `${U}1581091226825-a6a2a5aee158${Q}&w=900`,
  `${U}1581092160562-40aa08e78837${Q}&w=900`,
  `${U}1581093588401-fbb62a02f120${Q}&w=900`,
  `${U}1565793298595-6a879b1d9492${Q}&w=900`,
  `${U}1486262715619-67b85e0b08d3${Q}&w=900`,
  `${U}1504917595217-d4dc5ebe6122${Q}&w=900`,
  `${U}1567789884554-0b844b597180${Q}&w=900`,
  `${U}1531297484001-80022131f5a1${Q}&w=900`,
];

export const newsImages = [
  `${U}1497435334941-8c899ee9e8e9${Q}&w=1000`,
  `${U}1542013936693-884638332954${Q}&w=1000`,
  `${U}1416879595882-3373a0480b5b${Q}&w=1000`,
  `${U}1574169208507-84376144848b${Q}&w=1000`,
  `${U}1493238792000-8113da705763${Q}&w=1000`,
  `${U}1486262715619-67b85e0b08d3${Q}&w=1000`,
];

export function pickImage(pool: string[], seed: number) {
  return pool[seed % pool.length];
}
