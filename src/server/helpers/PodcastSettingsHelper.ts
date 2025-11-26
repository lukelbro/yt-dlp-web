import { CacheHelper } from './CacheHelper';

const PODCAST_SETTINGS_FILE = 'podcast-settings.json';

export interface PodcastSettings {
  feedTitle: string;
  feedDescription: string;
  port: number;
  convertFormat: boolean;
  useSponsorBlock: boolean;
}

export const defaultPodcastSettings: PodcastSettings = {
  feedTitle: 'yt-dlp-web Podcast',
  feedDescription: 'A podcast of downloaded videos.',
  port: 3001,
  convertFormat: false,
  useSponsorBlock: false,
};

export class PodcastSettingsHelper {
  static async get(): Promise<PodcastSettings> {
    const settings = await CacheHelper.get<PodcastSettings>(PODCAST_SETTINGS_FILE);
    return { ...defaultPodcastSettings, ...settings };
  }

  static async set(settings: Partial<PodcastSettings>): Promise<void> {
    const currentSettings = await this.get();
    const newSettings = { ...currentSettings, ...settings };
    await CacheHelper.set(PODCAST_SETTINGS_FILE, newSettings);
  }
}
