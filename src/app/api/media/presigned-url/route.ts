import { getMultiplartSignedUrl } from '@/lib/aws/s3';
import { NextResponse } from 'next/server';
 
 
export const POST = async (request: Request) => {
  const {key, uploadId, partNumber} = await request.json();

  const url = await getMultiplartSignedUrl(key, uploadId, partNumber)
  return NextResponse.json({url});
}