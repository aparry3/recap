import React from "react"
import App from "./App";
import { redirect } from "next/navigation";
import { selectGalleryByPath } from "@/lib/db/galleryService";
import { Gallery } from "@/lib/types/Gallery";
import { cookies } from "next/headers";
import { AlbumMediaData } from "@/lib/types/Album";
import { selectAlbum } from "@/lib/db/albumService";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{path: string}>;
    searchParams: Promise<{password?: string, album?: string}>;
}
export async function generateMetadata(
    { params }: PageProps,
  ): Promise<Metadata> {
    const {path: encodedPath} = await params
    const path = decodeURIComponent(encodedPath)
    let gallery: Gallery
    try {
        gallery = await selectGalleryByPath(path)

    } catch (error) {
        return {
            title: `Recap`,
            description: `Redirecting....`,
          }
    }
      
    return {
        title: `Recap - ${gallery.name}`,
        description: `Share your photos and videos with ${gallery.name}. Recap is the best way to share your photos and videos for everyone at your wedding.`,
        openGraph: {
            title: `Recap - ${gallery.name}`,
            description: `Share your photos and videos with ${gallery.name}. Recap is the best way to share your photos and videos for everyone at your wedding.`,
            images: [
                {
                    url: '/branding/screenshots.png',
                    width: 1369,
                    height: 718,
                    alt: 'Recap Wedding Photo Gallery',
                },
            ],
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `Recap - ${gallery.name}`,
            description: `Share your photos and videos with ${gallery.name}. Recap is the best way to share your photos and videos for everyone at your wedding.`,
            images: ['/branding/wordmark.png'],
        },
    }
  }
  
const GalleryPage = async ({params, searchParams}: PageProps) => {
    // const ipAddress = getIpAddress(headerList)
    let gallery: Gallery
    let album: AlbumMediaData | undefined
    const [{path: encodedPath}, query] = await Promise.all([params, searchParams])
    let password = query.password
    const albumId = query.album
    const path = decodeURIComponent(encodedPath)

    try {
        gallery = await selectGalleryByPath(path)
        if (!password) {
            const cookieStore = await cookies()
            password = cookieStore.get(gallery.id)?.value
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
