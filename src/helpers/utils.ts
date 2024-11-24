import { Media } from "@/lib/types/Media";
import { OrientationMedia } from "./providers/gallery";

export const isVideo = (media: Media | OrientationMedia): boolean => {
    return media.contentType.startsWith('video')
}

export const isImage = (media: Media | OrientationMedia): boolean => {
    return media.contentType.startsWith('image')
}

export function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters[randomIndex];
    }

    return result;
}

