import React, { FC } from "react"
import App from "./App";
import { redirect } from "next/navigation";
import { selectGalleryByPath } from "@/lib/db/galleryService";
import { Gallery } from "@/lib/types/Gallery";
import { cookies } from "next/headers";
import { AlbumMediaData } from "@/lib/types/Album";
import { selectAlbum } from "@/lib/db/albumService";
import { Metadata, ResolvingMetadata } from "next";

interface PageProps {
    params: {path: string};
    searchParams: {password?: string, album?: string};
}
export async function generateMetadata(
    { params }: PageProps,
  ): Promise<Metadata> {
    const path = decodeURIComponent(params.path)
    const gallery = await selectGalleryByPath(path)
      
    return {
      title: `Recap - ${gallery.name}`,
      description: `Share your photos and videos with ${gallery.name}. Recap is the best way to share your photos and videos for everyone at your wedding.`,
    }
  }
  
const GalleryPage: FC<PageProps> = async ({params, searchParams}) => {
    // const ipAddress = getIpAddress(headerList)
    let gallery: Gallery
    let album: AlbumMediaData | undefined
    let password = searchParams.password
    const albumId = searchParams.album
    const path = decodeURIComponent(params.path)

    try {
        gallery = await selectGalleryByPath(path)
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