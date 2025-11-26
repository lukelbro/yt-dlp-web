import { NextRequest, NextResponse } from 'next/server';
import { PodcastSettingsHelper } from '@/server/helpers/PodcastSettingsHelper';

export async function GET() {
  const settings = await PodcastSettingsHelper.get();
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await PodcastSettingsHelper.set(body);
  return NextResponse.json({ ok: true });
}
