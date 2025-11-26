import { Feed } from 'feed';
import { getVideoList } from './yt-dlp-web';
import { serverEnv } from './helpers/serverEnv';
import { VideoInfo } from '@/types/video';
import {
  PodcastSettingsHelper,
  defaultPodcastSettings,
} from './helpers/PodcastSettingsHelper';
import path from 'path';

const getPodcastBaseUrl = () => {
  const port = serverEnv.PODCAST_PORT || 3001;
  const host = serverEnv.HOST || 'localhost';
  const protocol = serverEnv.NODE_ENV === 'production' ? 'https' : 'http';
  return `${protocol}://${host}:${port}`;
};

const getWebUIBaseUrl = () => {
  const port = serverEnv.PORT || 3000;
  const host = serverEnv.HOST || 'localhost';
  const protocol = serverEnv.NODE_ENV === 'production' ? 'https' : 'http';
  return `${protocol}://${host}:${port}`;
};

export async function generateRssFeed() {
  const podcastBaseUrl = getPodcastBaseUrl();
  const webUIBaseUrl = getWebUIBaseUrl();
  const settings = await PodcastSettingsHelper.get();

  const feed = new Feed({
    title: settings.feedTitle || defaultPodcastSettings.feedTitle,
    description:
      settings.feedDescription || defaultPodcastSettings.feedDescription,
    id: podcastBaseUrl,
    link: webUIBaseUrl,
    language: 'en',
    image: `${webUIBaseUrl}/favicon.ico`,
    favicon: `${webUIBaseUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    updated: new Date(),
    generator: 'yt-dlp-web',
    feedLinks: {
      rss: `${podcastBaseUrl}/rss`,
    },
  });

  const { items: videoItems } = await getVideoList();
  const videos: VideoInfo[] = Object.values(videoItems);

  videos.forEach((video) => {
    if (video.status !== 'completed') return;

    const isAudio = settings.convertFormat;
    const extension = isAudio ? 'm4a' : path.extname(video.file.name || '.mp4').slice(1);
    const mediaType = isAudio ? 'audio/mp4' : 'video/mp4';
    const mediaUrl = `${webUIBaseUrl}/api/v/${video.uuid}/${video.uuid}.${extension}`;

    feed.addItem({
      title: video.title || '',
      id: video.url,
      link: video.url,
      description: video.description || '',
      date: new Date(video.createdAt),
      image: video.localThumbnail
        ? `${webUIBaseUrl}/api/thumbnail/${video.uuid}`
        : video.thumbnail || '',
      enclosure: {
        url: mediaUrl,
        type: mediaType,
        length: video.file.size || 0,
      },
      // Chapters are embedded in the media file if `embedChapters` was true during download.
      // The 'feed' library doesn't have a standard way to represent embedded chapters in the RSS XML itself.
    });
  });

  return feed.rss2();
}
