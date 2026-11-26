// Compresses an uploaded image file to a lightweight square JPEG data URL (~15-30KB)
// suitable for local storage and Firestore profile/leaderboard sync.

export async function compressAvatarPhoto(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Pilih file gambar (JPG, PNG, atau WebP).');
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Format gambar tidak didukung.'));
    el.src = dataUrl;
  });

  const size = 180;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas tidak tersedia di browser.');
  }

  // Center-crop square
  const minSide = Math.min(img.width, img.height);
  const sx = (img.width - minSide) / 2;
  const sy = (img.height - minSide) / 2;
  ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);

  let compressed = canvas.toDataURL('image/jpeg', 0.78);
  if (compressed.length > 55000) {
    compressed = canvas.toDataURL('image/jpeg', 0.55);
  }
  return compressed;
}
