const express = require('express');
const cors = require('cors');
const Parser = require('rss-parser');
const cron = require('node-cron');

const app = express();
const port = process.env.PORT || 3000;
const parser = new Parser();

let techNews = [];

const feedUrls = [
  "https://www.theverge.com/rss/index.xml",
  "https://www.engadget.com/rss.xml",
  "https://feeds.arstechnica.com/arstechnica/technology-lab",
];

async function fetchNews() {
  techNews = [];
  for (const url of feedUrls) {
    const feed = await parser.parseURL(url);
    techNews.push(...feed.items.slice(0, 5));
  }
}

cron.schedule('0 7 * * *', fetchNews);
fetchNews();

app.use(cors());

app.get('/api/news', (req, res) => {
  res.json(techNews);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
