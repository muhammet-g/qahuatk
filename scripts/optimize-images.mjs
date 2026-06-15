import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceRoot = path.resolve("src/asesset/images");
const outputRoot = path.resolve("src/asesset/images-optimized");
const maxWidth = 900;
const quality = 72;

async function listFiles(dir, extension) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return listFiles(fullPath, extension);
      }
      return entry.isFile() && entry.name.toLowerCase().endsWith(extension) ? [fullPath] : [];
    }),
  );
  return files.flat();
}

const files = await listFiles(sourceRoot, ".png");

await Promise.all(
  files.map(async (file) => {
    const relativePath = path.relative(sourceRoot, file);
    const outputPath = path.join(outputRoot, relativePath).replace(/\.png$/i, ".webp");
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    await sharp(file)
      .rotate()
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(outputPath);
  }),
);

const optimizedFiles = await listFiles(outputRoot, ".webp");
const sumSizes = async (paths) =>
  (await Promise.all(paths.map(async (file) => (await fs.stat(file)).size))).reduce(
    (sum, size) => sum + size,
    0,
  );

const originalBytes = await sumSizes(files);
const optimizedBytes = await sumSizes(optimizedFiles);
const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

console.log(`Optimized ${files.length} images`);
console.log(`Original: ${mb(originalBytes)}`);
console.log(`Optimized: ${mb(optimizedBytes)}`);
