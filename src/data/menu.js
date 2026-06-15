import drinks from "./drinks.json";

const optimizedImageModules = import.meta.glob("../asesset/images-optimized/**/*.webp", {
  eager: true,
  import: "default",
  query: "?url",
});

const getOptimizedPath = (path) =>
  path.replace("../asesset/images/", "../asesset/images-optimized/").replace(/\.png$/i, ".webp");

const resolveImage = (path) => optimizedImageModules[getOptimizedPath(path)] || path;

const productDescription = (components) => `يتكون من ${components.join("، ")}.`;

export const sizeOptions = [
  { id: "S", label: "صغير", delta: -3 },
  { id: "M", label: "وسط", delta: 0 },
  { id: "L", label: "كبير", delta: 4 },
];

const getSizePrices = (price) =>
  Object.fromEntries(
    sizeOptions.map((size) => [size.id, Math.max(8, price + size.delta)]),
  );

const normalizeProduct = (product) => ({
  ...product,
  sizePrices: getSizePrices(product.price),
  image: resolveImage(product.image),
  hero: resolveImage(product.image),
  shortDescription: product.components.slice(0, 3).join("، "),
  description: productDescription(product.components),
});

export const categories = drinks.categories.map((category) => ({
  ...category,
  image: resolveImage(category.image),
}));

export const products = drinks.products.map(normalizeProduct);

export const addons = [
  { name: "سكر إضافي", price: 0 },
  { name: "حليب لوز", price: 3 },
  { name: "صوص كراميل", price: 4 },
  { name: "كريمة", price: 4 },
];
