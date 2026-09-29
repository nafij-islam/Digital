interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: string | number;
  format?: string;
  crop?: string;
}

/**
 * Generates an optimized Cloudinary delivery URL with f_auto, q_auto and size transformations.
 * If the image is not hosted on Cloudinary, returns the original URL untouched.
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  options: ImageOptimizationOptions = {}
): string {
  if (!url) return "/placeholder-image.png";

  // Check if it's a Cloudinary URL
  if (!url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) {
    return url;
  }

  const {
    width,
    height,
    quality = "auto:good",
    format = "auto",
    crop = "limit",
  } = options;

  // Build transformation params
  const transforms: string[] = [`f_${format}`, `q_${quality}`];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop && (width || height)) transforms.push(`c_${crop}`);

  const transformString = transforms.join(",");

  // If already transformed, don't double transform
  if (url.includes("/image/upload/f_auto") || url.includes("/image/upload/q_auto")) {
    return url;
  }

  return url.replace("/image/upload/", `/image/upload/${transformString}/`);
}
