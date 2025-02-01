import { insertAlbumMedia } from "@/lib/db/albumService";
import { NextResponse } from "next/server";

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

