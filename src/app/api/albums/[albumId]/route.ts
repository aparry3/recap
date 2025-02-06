import { deleteAlbum, updateAlbum } from "@/lib/db/albumService";
import { deleteAlbumMedia } from "@/lib/db/albumService";
import { AlbumUpdate } from "@/lib/types/Album";
import { NextResponse } from "next/server";

export const PUT = async (req: Request, ctx: { params: { albumId: string } }) => {
    const albumUpdate: AlbumUpdate = await req.json()
    const { albumId } = ctx.params

    try {
        const album = await updateAlbum(albumId, albumUpdate)

        return NextResponse.json({album}, {status: 200})
    } catch (e: any) {
        console.error(e)
        return NextResponse.json({error: e.message}, {status: 400})

    }
};

export const DELETE = async (req: Request, ctx: { params: { albumId: string } }) => {
    const { albumId } = ctx.params

    try {
        await deleteAlbumMedia(albumId)
        const success = await deleteAlbum(albumId)
        return NextResponse.json({success}, {status: 200})
    } catch (e: any) {
        console.error(e)
        return NextResponse.json({error: e.message}, {status: 400})

    }
};


