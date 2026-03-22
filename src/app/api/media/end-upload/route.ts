import { NextResponse } from 'next/server';
import { completeMultipartUpload } from '@/lib/aws/s3';


if (!process.env.ASSETS_CLOUDFRONT_URL) throw new Error('ASSETS_CLOUDFRONT_URL is not set');
export async function POST(request: Request) {
    const {uploadId, parts, key} = await request.json();
    console.log(uploadId, parts, key)
    completeMultipartUpload(key, uploadId, parts)
    const url = `${process.env.ASSETS_CLOUDFRONT_URL}/${key}`
    return NextResponse.json({ url });
}