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
    try {
        await db.files.add({id, galleryId, file, previewFile});
        console.log(`Successfully added file ${id} to IndexedDB`);
        return id;
    } catch (error: any) {
        console.error(`Error adding file ${id} to IndexedDB:`, error);
        // If the error is due to the file already existing, try to update it
        if (error.name === 'ConstraintError') {
            try {
                // Delete and re-add instead of update to avoid TypeScript circular reference issue
                await db.files.delete(id);
                await db.files.add({id, galleryId, file, previewFile});
                console.log(`Updated existing file ${id} in IndexedDB`);
                return id;
            } catch (updateError) {
                console.error(`Error updating file ${id} in IndexedDB:`, updateError);
                throw updateError;
            }
        }
        throw error;
    }
}

export const removeFile = async (id: string): Promise<boolean> => {
    try {
        await db.files.delete(id);
        console.log(`Successfully removed file ${id} from IndexedDB`);
        return true;
    } catch (error) {
        console.error(`Error removing file ${id} from IndexedDB:`, error);
        return false;
    }
}

export const readFiles = async (): Promise<TempFile[]> => {
    try {
        const files = await db.files.toArray();
        console.log("Files in IndexedDB:", files.length);
        
        // Verify files are valid before returning
        const validFiles = files.filter(file => {
            if (!file.file || !file.previewFile || !file.id || !file.galleryId) {
                console.warn(`Found invalid file entry in IndexedDB: ${file.id}`);
                // Optionally clean up invalid entries
                db.files.delete(file.id).catch(err => 
                    console.error(`Error cleaning up invalid file ${file.id}:`, err)
                );
                return false;
            }
            return true;
        });
        
        return validFiles;
    } catch (error) {
        console.error("Error reading files from IndexedDB:", error);
        return [];
    }
}