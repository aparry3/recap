import { Album, AlbumMediaData, NewAlbumData } from "@/lib/types/Album";


export const createAlbum = async (galleryId: string, personId: string, name: string): Promise<Album> => {
    const data = await fetch(`/api/galleries/${galleryId}/albums`, {
        method: 'POST',
        body: JSON.stringify({name, personId, galleryId}) 
    }).then(res => res.json())
    return data.album as Album
}

export const fetchAlbums = async (galleryId: string): Promise<AlbumMediaData[]> => {
    const data = await fetch(`/api/galleries/${galleryId}/albums`).then(res => res.json())
    return data.albums
}

export const addMediaToAlbum = async (albumId: string, mediaIds: string[]): Promise<AlbumMediaData> => {
    const data = await fetch(`/api/albums/${albumId}/media`, {
        method: 'POST',
        body: JSON.stringify({mediaIds}) 
    }).then(res => res.json())
    return data.album as AlbumMediaData
}