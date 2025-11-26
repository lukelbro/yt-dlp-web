import { NextRequest, NextResponse } from 'next/server';
import { generateRssFeed } from '@/server/podcast';

export async function GET(req: NextRequest) {
  const feed = await generateRssFeed();
  return new NextResponse(feed, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
}
