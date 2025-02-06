import { insertAlbumMedia, removeAlbumMedia } from "@/lib/db/albumService";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: Request, ctx: { params: { albumId: string } }) => {
    const {mediaIds}: {mediaIds: string[]} = await req.json()
    const { albumId } = ctx.params

    try {
        const media = await insertAlbumMedia(albumId, mediaIds)

        return NextResponse.json({media}, {status: 200})
    } catch (e: any) {
        console.error(e)
        return NextResponse.json({error: e.message}, {status: 400})

    }
};

export const DELETE = async (req: NextRequest, ctx: { params: { albumId: string } }) => {
    const searchParams = req.nextUrl.searchParams
    const mediaIds = searchParams.getAll('mediaIds')
    if (!mediaIds || mediaIds.length === 0) return NextResponse.json({error: 'No mediaIds provided'}, {status: 400})
    const { albumId } = ctx.params

    try {
        const media = await removeAlbumMedia(albumId, mediaIds)

        return NextResponse.json({media}, {status: 200})
    } catch (e: any) {
        console.error(e)
        return NextResponse.json({error: e.message}, {status: 400})

    }
};


