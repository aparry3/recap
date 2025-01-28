import Upload from '@/components/Upload';
import Dexie, {type EntityTable} from 'dexie';


interface TempFileUpload {
    id: string
    file: File
    previewFile: File
    galleryId: string
}
interface UploadDb extends Dexie {
    files: EntityTable<TempFileUpload, 'id'>;
}

const db = new Dexie('recap-temp-files') as UploadDb;

db.version(1).stores({
    files: '&id, galleryId'
});

export const addFile = async (id: string, file: File, previewFile: File, galleryId: string) => {
    await db.files.add({id, file, previewFile, galleryId});
    return id;
}

export const readFiles = async () => {
    return await db.files.toArray();
}

export const removeFile = async (id: string) => {
    await db.files.delete(id);
    return id;
}
