import { NextRequest, NextResponse } from "next/server";
import { getLikesCount } from "@/lib/db/likeService";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const mediaId = searchParams.get('mediaId');

    if (!mediaId) {
        return NextResponse.json({ error: 'Missing mediaId parameter' }, { status: 400 });
    }

    try {
        const count = await getLikesCount(mediaId);
        return NextResponse.json({ count });
    } catch (error) {
        console.error('Error getting likes count:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 