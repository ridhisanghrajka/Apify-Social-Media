# Social Media Ad Spy Tool

A powerful crawler built with Apify, Crawlee, and Puppeteer that scrapes ad libraries from major social media platforms including Meta (Facebook), LinkedIn, and Google Ads.

## Features

- Scrapes ad libraries from multiple platforms:
  - Meta (Facebook) Ads Library
  - LinkedIn Ads
  - Google Ads Transparency
- Extracts detailed ad information including:
  - Ad text content
  - Start and end dates
  - Targeting information
  - Ad status
  - Media types
- Uses proxy rotation for reliable scraping
- Configurable concurrency and request limits

## Input Configuration

The Actor accepts the following input parameters:

```json
{
    "competitorName": "Example Company",
    "startUrls": [
        { "url": "https://www.facebook.com/ads/library/" },
        { "url": "https://www.linkedin.com/ad/targeting/" },
        { "url": "https://ads.google.com/transparency/" }
    ],
    "maxAds": 100,
    "maxConcurrency": 2
}
```

### Parameters

- `competitorName` (required): The name of the competitor to search for
- `startUrls` (optional): Array of URLs to start crawling from
- `maxAds` (optional): Maximum number of ads to scrape (default: 100)
- `maxConcurrency` (optional): Maximum number of concurrent requests (default: 2)

## Output

The Actor outputs an array of ad objects with the following structure:

```json
{
    "platform": "Facebook|LinkedIn|Google",
    "adText": "Ad content text",
    "startDate": "Start date of the ad",
    "endDate": "End date of the ad",
    "status": "Ad status",
    "targeting": "Targeting information",
    "mediaType": "Type of media used"
}
```

## Running the Actor

1. Create a new Actor on Apify
2. Upload the code files
3. Configure the input parameters
4. Run the Actor

## Dependencies

- apify: ^3.0.0
- crawlee: ^3.0.0
- puppeteer: ^21.0.0

## Notes

- The Actor uses proxy rotation to avoid rate limiting
- Browser automation is configured to handle modern web applications
- Results are automatically saved to the Apify dataset 