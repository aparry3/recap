"use client"
import { useCallback, useEffect, useState } from 'react';
import { useUser } from '../providers/user';
import { getLikesCount, hasLiked, toggleLike } from '../api/likeClient';

export const useLikes = (mediaId: string) => {
    const { person } = useUser();
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLikeStatus = async () => {
            if (mediaId) {
                try {
                    const [liked, count] = await Promise.all([
                        person?.id ? hasLiked(mediaId, person.id) : false,
                        getLikesCount(mediaId)
                    ]);
                    setIsLiked(liked);
                    setLikesCount(count);
                } catch (error) {
                    console.error('Error checking like status:', error);
                }
                setLoading(false);
            }
        };
        checkLikeStatus();
    }, [mediaId, person?.id]);

    const handleToggleLike = useCallback(async () => {
        if (!person?.id || !mediaId) return;

        try {
            const response = await toggleLike(mediaId, person.id);
            setIsLiked(response.liked);
            setLikesCount(prev => response.liked ? prev + 1 : Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    }, [mediaId, person?.id]);

    return {
        isLiked,
        likesCount,
        toggleLike: handleToggleLike,
        loading
    };
}; 