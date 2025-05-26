import { createPlaywrightRouter } from 'crawlee';

export const router = createPlaywrightRouter();

// Facebook Ads Library Handler
router.addHandler('FACEBOOK', async ({ page, request, log }) => {
    const { competitorName } = request.userData;
    
    log.info(`Processing Facebook Ads Library for ${competitorName}`);
    
    // Wait for the search input and enter competitor name
    await page.waitForSelector('input[placeholder*="Search"]');
    await page.type('input[placeholder*="Search"]', competitorName);
    await page.keyboard.press('Enter');
    
    // Wait for results to load
    await page.waitForSelector('[role="main"]');
    
    // Extract ad information
    const ads = await page.evaluate(() => {
        const adElements = document.querySelectorAll('[role="article"]');
        return Array.from(adElements).map(ad => ({
            platform: 'Facebook',
            adText: ad.querySelector('[data-ad-preview="message"]')?.textContent || '',
            startDate: ad.querySelector('[data-ad-preview="start_date"]')?.textContent || '',
            endDate: ad.querySelector('[data-ad-preview="end_date"]')?.textContent || '',
            status: ad.querySelector('[data-ad-preview="status"]')?.textContent || '',
            mediaType: ad.querySelector('[data-ad-preview="media_type"]')?.textContent || '',
        }));
    });
    
    // Save the results
    await Actor.pushData(ads);
});

// LinkedIn Ads Handler
router.addHandler('LINKEDIN', async ({ page, request, log }) => {
    const { competitorName } = request.userData;
    
    log.info(`Processing LinkedIn Ads for ${competitorName}`);
    
    // Wait for the search input and enter competitor name
    await page.waitForSelector('input[type="search"]');
    await page.type('input[type="search"]', competitorName);
    await page.keyboard.press('Enter');
    
    // Wait for results to load
    await page.waitForSelector('.ad-targeting-results');
    
    // Extract ad information
    const ads = await page.evaluate(() => {
        const adElements = document.querySelectorAll('.ad-targeting-result');
        return Array.from(adElements).map(ad => ({
            platform: 'LinkedIn',
            adText: ad.querySelector('.ad-text')?.textContent || '',
            targeting: ad.querySelector('.targeting-info')?.textContent || '',
            duration: ad.querySelector('.ad-duration')?.textContent || '',
            status: ad.querySelector('.ad-status')?.textContent || '',
        }));
    });
    
    // Save the results
    await Actor.pushData(ads);
});

// Google Ads Transparency Handler
router.addHandler('GOOGLE', async ({ page, request, log }) => {
    const { competitorName } = request.userData;
    
    log.info(`Processing Google Ads Transparency for ${competitorName}`);
    
    // Wait for the search input and enter competitor name
    await page.waitForSelector('input[type="search"]');
    await page.type('input[type="search"]', competitorName);
    await page.keyboard.press('Enter');
    
    // Wait for results to load
    await page.waitForSelector('.ad-results');
    
    // Extract ad information
    const ads = await page.evaluate(() => {
        const adElements = document.querySelectorAll('.ad-result');
        return Array.from(adElements).map(ad => ({
            platform: 'Google',
            adText: ad.querySelector('.ad-text')?.textContent || '',
            advertiser: ad.querySelector('.advertiser-name')?.textContent || '',
            startDate: ad.querySelector('.start-date')?.textContent || '',
            endDate: ad.querySelector('.end-date')?.textContent || '',
            targeting: ad.querySelector('.targeting-info')?.textContent || '',
        }));
    });
    
    // Save the results
    await Actor.pushData(ads);
});

// Default handler for unknown URLs
router.addDefaultHandler(async ({ request, log }) => {
    log.info(`Processing ${request.url}...`);
    
    // Determine the platform based on the URL
    let platform = 'UNKNOWN';
    if (request.url.includes('facebook.com')) {
        platform = 'FACEBOOK';
    } else if (request.url.includes('linkedin.com')) {
        platform = 'LINKEDIN';
    } else if (request.url.includes('google.com')) {
        platform = 'GOOGLE';
    }
    
    // Add the platform to the request userData
    request.userData.platform = platform;
    
    // Route to the appropriate handler
    await router.handleRequest(request);
}); 