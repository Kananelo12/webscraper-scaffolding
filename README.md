# Scaffolding for Web Scraper
This project contains a set of Node.js scripts for scraping data from various websites. It uses JSDOM for parsing HTML, ScraperAPI for rendering dynamic pages, and Node Fetch for making HTTP requests.

## Installation

1. [Clone](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository-from-github/cloning-a-repository) this repository
```git clone <repo-url>```  
1. Run `npm install`  

## Environment Variables
This project uses [dotenv](https://www.npmjs.com/package/dotenv) for environment variables.
Create a .env file in the root directory and add your API key:
```SCRAPER_API_KEY=your_scraperapi_key_here```  

## ScraperAPI Setup
- Go to [ScraperAPI](https://www.scraperapi.com/) and sign up for an account.
- Generate an API key.
- Add the key to your .env file as shown above.
- The ```render=true``` parameter is used for dynamic pages with JavaScript content (like IGDB).  

Example:
```https://api.scraperapi.com/?api_key=YOUR_KEY&render=true&url=https://www.example.com```

## How to run
Scrape for links and images from any website   
```node webscraper.js [webpage url]```  

Scrap an email list from the following website : https://www.ibba.org/find-a-business-broker    
```node emailScraper.js```

## Build a Game Database
#### Scrapes details of upcoming games from IGDB, including:
- Game name
- Genre
- Platforms
- Release date
- Publishers
- Profile image
- Trailer link (if available)  

Run: ```node gameDatabase.js```

## Project Structure
```
/webscraper.js     # Script to extract links and images
/emailScraper.js   # Script to collect emails
/gameDatabase.js   # Script to build upcoming games database
/.env              # Environment variables (ignored by Git)
```

## Useful Resources
- [Node Fetch](https://github.com/node-fetch/node-fetch)  
- [JSDOM Package](https://www.npmjs.com/package/jsdom)  
- [ScraperAPI](https://www.scraperapi.com/)  
- [Scraping Example Blog](https://menubar.io/simple-web-scraping) (see “Scraping with Node” section)