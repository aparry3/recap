import { CompleteMultipartUploadCommand, CreateMultipartUploadCommand, DeleteObjectCommand, PutObjectCommand, S3Client, UploadPartCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client([{
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,  
}])

export const generatePresignedUrl = async (key: string, contentType: string, expiresIn = 60) => {  
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key, // You will need to pass and retrieve the file key
        ContentType: contentType,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
};

export const getMultiplartSignedUrl = async (key: string, uploadId: string, partNumber: number, expiresIn = 60) => {  
    const command = new UploadPartCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key, // You will need to pass and retrieve the file key
        UploadId: uploadId,
        PartNumber: partNumber,
      });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
};

export const completeMultipartUpload = async (key: string, uploadId: string, parts: any) => {
    const command = new CompleteMultipartUploadCommand({
        Bucket: process.env.AWS_S3_BUCKET || '',
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {Parts: parts}
    })
    return await s3Client.send(command);
}

export const beginMultipartUpload = async (key: string, contentType: string, expiresIn = 60): Promise<string> => {
    const command = new CreateMultipartUploadCommand({
        Bucket: process.env.AWS_S3_BUCKET || '',
        Key: key,
        ContentType: contentType,
    })
    try {
        const response = await s3Client.send(command);
        if (!response.UploadId) throw new Error('Failed to initiate multipart upload for key: ' + key)
        return response.UploadId    
    } catch (e: any) {
        console.error(e)
        throw e
    }
  }
  

export const deleteObject = async (key: string) => {
    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key, // You will need to pass and retrieve the file key
    });
    return await s3Client.send(command);
};
  


export default s3Client
