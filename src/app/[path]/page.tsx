import React, { FC } from "react"
import App from "./App";
import { redirect } from "next/navigation";
import { selectGalleryByPath } from "@/lib/db/galleryService";
import { Gallery } from "@/lib/types/Gallery";


const GalleryPage: FC<{params: {path: string}}> = async ({params}) => {
    // const ipAddress = getIpAddress(headerList)
    let gallery: Gallery
    try {
        gallery = await selectGalleryByPath(params.path)
    } catch (e: any) {
        return redirect('/')
    }
    return (
        <App gallery={gallery}/>
    )
}

export default GalleryPage;