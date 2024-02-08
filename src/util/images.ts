
import type { ImageMetadata } from "astro";

const images = import.meta.glob<{ default: ImageMetadata }>(
    "/src/images/**/*.{jpeg,jpg,png}"
);
  
export const getDynamicImage = (src: string): Promise<{ default: ImageMetadata }> => {
    const imgSrc = `/src${src}`;

    if (!images[imgSrc]) {
        throw new Error(`"${imgSrc}" does not exist.`);
    }

    return images[imgSrc]();
};