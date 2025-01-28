import Dexie, { EntityTable } from 'dexie';


export interface TempFile {
    file: File
    previewFile: Blob
    id: string
    galleryId: string
}

interface ClientDb extends Dexie {
    files: EntityTable<TempFile, 'id'>
}

const db = new Dexie('recap-temp-files') as ClientDb;

db.version(1).stores({
    files: 'id, galleryId'
});

export const addFile = async (id: string, galleryId: string, file: File, previewFile: Blob): Promise<string> => {
    await db.files.add({id, galleryId, file, previewFile})
    return id
}

export const removeFile = async (id: string): Promise<boolean> => {
    await db.files.delete(id)
    return true
}

export const readFiles = async (): Promise<TempFile[]> => {
    const files = await db.files.toArray()
    return files
}