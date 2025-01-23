import { insertAlbumMedia } from "@/lib/db/albumService";
import { NextResponse } from "next/server";

export const POST = async (req: Request, ctx: { params: { albumId: string } }) => {
    const {mediaIds}: {mediaIds: string[]} = await req.json()
    const { albumId } = ctx.params

    try {
        const album = await insertAlbumMedia(albumId, mediaIds)

        return NextResponse.json({album}, {status: 200})
    } catch (e: any) {
        return NextResponse.json({error: e.message}, {status: 400})

    }
};

