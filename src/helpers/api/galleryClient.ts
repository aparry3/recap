import { NewGalleryData, Gallery, GalleryPerson } from "@/lib/types/Gallery";


export const createGallery = async (newGallery: NewGalleryData, personId: string): Promise<Gallery> => {
    const data = await fetch('/api/galleries', {
        method: 'POST',
        body: JSON.stringify({...newGallery, personId}) 
    }).then(res => res.json())
    return data.gallery
}

export const fetchGallery = async (galleryId: string): Promise<Gallery> => {
    const data = await fetch(`/api/galleries/${galleryId}`).then(res => res.json())
    return data.gallery
}

export const addPersonToGallery = async (galleryId: string, personId: string): Promise<GalleryPerson> => {
    const data = await fetch(`/api/galleries/${galleryId}/people`, {
        method: 'POST',
        body: JSON.stringify({personId}) 
    }).then(res => res.json())
    return data.galleryPerson
}
