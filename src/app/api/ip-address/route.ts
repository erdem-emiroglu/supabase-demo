import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const headers = [
    'CF-Connecting-IP',
    'X-Forwarded-For',
    'X-Real-IP',
    'X-Client-IP',
    'X-Forwarded',
    'Forwarded-For',
    'Forwarded'
  ];

  const headerValues = headers.map(header => req.headers.get(header));
  const foundIp = headerValues.find(ip => ip);
  const [firstIp] = foundIp?.split(',') || [];
  const ipAddress = firstIp?.trim() || 'unknown';

  return NextResponse.json({ 
    ip: ipAddress,
    timestamp: new Date().toISOString()
  });
}