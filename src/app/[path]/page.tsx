import React, { FC } from "react"
import App from "./App";
import { redirect } from "next/navigation";
import { selectGalleryByPath } from "@/lib/db/galleryService";
import { Gallery } from "@/lib/types/Gallery";
import { cookies } from "next/headers";
import { setCookie } from "@/lib/cookies";
import { Album, AlbumMediaData } from "@/lib/types/Album";
import { selectAlbum } from "@/lib/db/albumService";


const GalleryPage: FC<{params: {path: string}, searchParams: {password?: string, album?: string}}> = async ({params, searchParams}) => {
    // const ipAddress = getIpAddress(headerList)
    let gallery: Gallery
    let album: AlbumMediaData | undefined
    let password = searchParams.password
    const albumId = searchParams.album
    try {
        gallery = await selectGalleryByPath(params.path)
        if (!password) {
            password = cookies().get(gallery.id)?.value
        } 
        if (albumId) {
            album = await selectAlbum(albumId)
        }
    } catch (e: any) {
        return redirect('/')
    }
    return (
        <App gallery={gallery} password={password} album={album}/>
    )
}

export default GalleryPage;