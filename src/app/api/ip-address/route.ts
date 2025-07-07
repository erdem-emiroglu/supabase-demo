import { NextRequest, NextResponse } from 'next/server';
import { getClientIpAddress } from '@/lib/ip-utils';

export async function GET(req: NextRequest) {
  const data = await getClientIpAddress();
  return NextResponse.json(data);
}