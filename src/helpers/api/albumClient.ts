import { Album, AlbumMediaData, AlbumUpdate, NewAlbumData } from "@/lib/types/Album";
import { Media } from "@/lib/types/Media";


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

export const deleteAlbum = async (albumId: string): Promise<AlbumMediaData[]> => {
    const data = await fetch(`/api/albums/${albumId}`, {
        method: 'DELETE',
    }).then(res => res.json())
    return data.success
}

export const addMediaToAlbum = async (albumId: string, mediaIds: string[]): Promise<Media[]> => {
    const data = await fetch(`/api/albums/${albumId}/media`, {
        method: 'POST',
        body: JSON.stringify({mediaIds}) 
    }).then(res => res.json())
    return data.media as Media[]
}

export const updateAlbum = async (albumId: string, albumUpdate: AlbumUpdate): Promise<Album> => {
    const data = await fetch(`/api/albums/${albumId}`, {
        method: 'PUT',
        body: JSON.stringify(albumUpdate) 
    }).then(res => res.json())
    return data.album as Album
}