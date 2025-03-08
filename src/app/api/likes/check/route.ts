import { NextRequest, NextResponse } from "next/server";
import { hasLiked } from "@/lib/db/likeService";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const mediaId = searchParams.get('mediaId');
    const personId = searchParams.get('personId');

    if (!mediaId || !personId) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    try {
        const result = await hasLiked(mediaId, personId);
        return NextResponse.json({ hasLiked: result });
    } catch (error) {
        console.error('Error checking like status:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 