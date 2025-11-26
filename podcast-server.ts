import http from 'http';
import { generateRssFeed } from '@/server/podcast';
import { serverEnv } from '@/server/helpers/serverEnv';

const port = parseInt(serverEnv.PODCAST_PORT || '3001', 10);

const server = http.createServer(async (req, res) => {
  if (req.url === '/rss') {
    try {
      const feed = await generateRssFeed();
      res.writeHead(200, { 'Content-Type': 'application/rss+xml' });
      res.end(feed);
    } catch (error) {
      console.error('Error generating RSS feed:', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Podcast server listening on port ${port}`);
});
