import { db } from ".";
import { Tag, NewTag, TagUpdate } from "../types/Tag";

export const insertTag = async (newTag: NewTag): Promise<Tag> => {
  const tag = await db.insertInto('tag').values(newTag).returningAll().executeTakeFirstOrThrow();
  return tag;
}

export const selectTagByMediaId = async (mediaId: string): Promise<Tag[]> => {
  const tags = await db.selectFrom('tag').where('mediaId', '=', mediaId).selectAll().execute();
  return tags;
}

export const selectTagsByPersonId = async (personId: string): Promise<Tag[]> => {
    const tags = await db.selectFrom('tag').where('personId', '=', personId).selectAll().execute();
    return tags;
}