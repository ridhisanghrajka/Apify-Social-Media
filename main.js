import { Actor } from 'apify';
import { PuppeteerCrawler } from 'crawlee';
import { router } from './routes.js';

await Actor.init();

// Get input from the Actor
const input = await Actor.getInput() || {};
const {
    competitorName,
    startUrls = [
        { url: 'https://www.facebook.com/ads/library/' },
        { url: 'https://www.linkedin.com/ad/targeting/' },
        { url: 'https://ads.google.com/transparency/' }
    ],
    maxAds = 100,
    maxConcurrency = 2,
} = input;

// Create proxy configuration
const proxyConfiguration = await Actor.createProxyConfiguration();

// Create a PuppeteerCrawler
const crawler = new PuppeteerCrawler({
    proxyConfiguration,
    requestHandler: router,
    maxConcurrency,
    maxRequestsPerCrawl: maxAds,
    launchContext: {
        launchOptions: {
            args: [
                '--disable-gpu',
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',
            ]
        }
    },
    preNavigationHooks: [
        async (crawlingContext, gotoOptions) => {
            const { page } = crawlingContext;
            await page.setViewport({ width: 1920, height: 1080 });
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        },
    ],
});

// Run the crawler
await crawler.run(startUrls);

// Gracefully exit the Actor
await Actor.exit(); 