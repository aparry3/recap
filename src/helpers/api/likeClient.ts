import { Like } from "@/lib/types/Like";

export const hasLiked = async (mediaId: string, personId: string): Promise<boolean> => {
    const response = await fetch(`/api/likes/check?mediaId=${mediaId}&personId=${personId}`);
    if (!response.ok) {
        throw new Error('Failed to check like status');
    }
    const data = await response.json();
    return data.hasLiked;
};

export const getLikesCount = async (mediaId: string): Promise<number> => {
    const response = await fetch(`/api/likes/count?mediaId=${mediaId}`);
    if (!response.ok) {
        throw new Error('Failed to get likes count');
    }
    const data = await response.json();
    return data.count;
};

interface ToggleLikeResponse {
    liked: boolean;
    like?: Like;
}

export const toggleLike = async (mediaId: string, personId: string): Promise<ToggleLikeResponse> => {
    const response = await fetch('/api/likes/toggle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mediaId, personId }),
    });
    if (!response.ok) {
        throw new Error('Failed to toggle like');
    }
    return response.json();
}; 