'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { PodcastSettings } from '@/server/helpers/PodcastSettingsHelper';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function PodcastSettingsPage() {
  const [settings, setSettings] = useState<PodcastSettings | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    axios.get<PodcastSettings>('/api/podcast/settings').then((res) => {
      setSettings(res.data);
    });
  }, []);

  const handleSave = () => {
    axios.post('/api/podcast/settings', settings).then(() => {
      toast({
        title: 'Settings saved',
      });
    });
  };

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Podcast Settings</h1>
        <Button onClick={handleSave}>Save</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>RSS Feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feed-title">Feed Title</Label>
            <Input
              id="feed-title"
              value={settings.feedTitle}
              onChange={(e) =>
                setSettings({ ...settings, feedTitle: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="feed-description">Feed Description</Label>
            <Input
              id="feed-description"
              value={settings.feedDescription}
              onChange={(e) =>
                setSettings({ ...settings, feedDescription: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              type="number"
              value={settings.port}
              onChange={(e) =>
                setSettings({ ...settings, port: parseInt(e.target.value, 10) })
              }
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Conversion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="convert-format">
              Convert to Apple Podcasts compatible format (m4a)
            </Label>
            <Switch
              id="convert-format"
              checked={settings.convertFormat}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, convertFormat: checked })
              }
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>SponsorBlock</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="use-sponsorblock">Use SponsorBlock</Label>
            <Switch
              id="use-sponsorblock"
              checked={settings.useSponsorBlock}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, useSponsorBlock: checked })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
