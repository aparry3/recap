import { generatePresignedUrl } from '@/lib/aws/s3';
import { NextResponse } from 'next/server';
 
 
export const POST = async (request: Request) => {
  const {key, contentType} = await request.json();
  const url = await generatePresignedUrl(key, contentType)
  return NextResponse.json({url});
}