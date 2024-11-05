import { Media, MediaWithUrl, NewMediaData } from "@/lib/types/Media"
import { OrientationImage } from "../providers/gallery"

export const createMedia = async (media: NewMediaData, galleryId: string): Promise<Media & {presignedUrl: string}> => {
    const data = await fetch(`/api/galleries/${galleryId}/media`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(media as NewMediaData),
    }).then(res => res.json())
    return {...data.media, presignedUrl: data.presignedUrl}
}

export const uploadMedia = async (presignedUrl: string, file: File): Promise<boolean> => {
    try {
        const data = await fetch(presignedUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type,
            },
            body: file,
        }).then(res => res.json())
        console.log(data)
        return true
    }  catch (error) {
        console.log(error)
        return false
    }
}

export const fetchGalleryImages = async (galleryId: string): Promise<MediaWithUrl[]> => {
    const data = await fetch(`/api/galleries/${galleryId}/media`).then(res => res.json())
    return data.media
}
