import { NewGalleryData, Gallery, GalleryPerson, GalleryUpdate, GalleryWithImagesAndEvents } from "@/lib/types/Gallery";


export const createGallery = async (newGallery: NewGalleryData, personId: string): Promise<GalleryWithImagesAndEvents> => {
    const data = await fetch('/api/galleries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...newGallery, personId}) 
    }).then(res => res.json())
    return {...data.gallery, images: data.images} as GalleryWithImagesAndEvents
}

export const updateGallery = async (galleryId: string, galleryUpdate: GalleryUpdate): Promise<GalleryWithImagesAndEvents> => {
    const data = await fetch(`/api/galleries/${galleryId}`, {
        method: 'PUT',
        body: JSON.stringify(galleryUpdate) 
    }).then(res => res.json())
    return {...data.gallery, images: data.images, events: data.events} as GalleryWithImagesAndEvents
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
