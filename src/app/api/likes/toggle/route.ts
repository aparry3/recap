import { NextRequest, NextResponse } from "next/server";
import { hasLiked, insertLike, deleteLike } from "@/lib/db/likeService";

export async function POST(request: NextRequest) {
    try {
        const { mediaId, personId } = await request.json();

        if (!mediaId || !personId) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const isLiked = await hasLiked(mediaId, personId);
        
        if (isLiked) {
            await deleteLike(mediaId, personId);
            return NextResponse.json({ liked: false });
        } else {
            const like = await insertLike(mediaId, personId);
            return NextResponse.json({ liked: true, like });
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 