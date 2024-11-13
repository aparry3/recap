import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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

export const deleteObject = async (key: string) => {
    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key, // You will need to pass and retrieve the file key
    });
    return await s3Client.send(command);
};
  


export default s3Client
