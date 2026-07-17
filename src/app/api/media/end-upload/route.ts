import { NextResponse } from 'next/server';
import { completeMultipartUpload } from '@/lib/aws/s3';

export async function POST(request: Request) {
    const cloudFrontUrl = process.env.AWS_CLOUDFRONT_URL;
    if (!cloudFrontUrl) throw new Error('AWS_CLOUDFRONT_URL is not set');

    const {uploadId, parts, key} = await request.json();
    console.log(uploadId, parts, key)
    completeMultipartUpload(key, uploadId, parts)
    const url = `${cloudFrontUrl}/${key}`
    return NextResponse.json({ url });
}
