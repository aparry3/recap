import { db } from ".";
import { Like, NewLike } from "../types/Like";
import { v4 as uuidv4 } from 'uuid';

export const insertLike = async (mediaId: string, personId: string): Promise<Like> => {
    const newLike: NewLike = {
        id: uuidv4(),
        mediaId,
        personId,
        created: new Date()
    };
    
    const like = await db
        .insertInto('likes')
        .values(newLike)
        .returningAll()
        .executeTakeFirstOrThrow();
    
    return like;
};

export const deleteLike = async (mediaId: string, personId: string): Promise<boolean> => {
    const result = await db
        .deleteFrom('likes')
        .where('mediaId', '=', mediaId)
        .where('personId', '=', personId)
        .executeTakeFirst();
    
    return !!result.numDeletedRows;
};

// Helper to check if a person has liked a media item
export const hasLiked = async (mediaId: string, personId: string): Promise<boolean> => {
    const like = await db
        .selectFrom('likes')
        .where('mediaId', '=', mediaId)
        .where('personId', '=', personId)
        .executeTakeFirst();
    
    return !!like;
};

export const getLikesCount = async (mediaId: string): Promise<number> => {
    const result = await db
        .selectFrom('likes')
        .where('mediaId', '=', mediaId)
        .select(db.fn.count('id').as('count'))
        .executeTakeFirst();
    
    return Number(result?.count || 0);
}; 