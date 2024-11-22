import React, { FC } from "react"
import App from "./App";
import { redirect } from "next/navigation";
import { selectGalleryByPath } from "@/lib/db/galleryService";
import { Gallery } from "@/lib/types/Gallery";
import { cookies } from "next/headers";
import { setCookie } from "@/lib/cookies";


const GalleryPage: FC<{params: {path: string}, searchParams: {password?: string}}> = async ({params, searchParams}) => {
    // const ipAddress = getIpAddress(headerList)
    let gallery: Gallery
    let password = searchParams.password
    try {
        gallery = await selectGalleryByPath(params.path)
        if (!password) {
            password = cookies().get(gallery.id)?.value
        } 
    } catch (e: any) {
        return redirect('/')
    }
    return (
        <App gallery={gallery} password={password}/>
    )
}

export default GalleryPage;