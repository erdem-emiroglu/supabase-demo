import { headers } from 'next/headers';

export async function getClientIpAddress() {
  try {
    const headersList = await headers();
    
    const ipHeaders = [
      'cf-connecting-ip',
      'x-forwarded-for',
      'x-real-ip',
      'x-client-ip',
      'x-forwarded',
      'forwarded-for',
      'forwarded'
    ];

    const headerValues = ipHeaders.map(header => headersList.get(header));
    const foundIp = headerValues.find(ip => ip);
    const [firstIp] = foundIp?.split(',') || [];
    const ipAddress = firstIp?.trim() || 'unknown';

    return {
      ip: ipAddress,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      ip: 'unknown',
      timestamp: new Date().toISOString()
    };
  }
} 