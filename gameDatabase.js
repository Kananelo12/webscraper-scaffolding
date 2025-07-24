import { JSDOM } from "jsdom";
import dotenv from "dotenv";

dotenv.config();

const baseUrl = "https://www.igdb.com";
const targetUrl = "https://www.igdb.com/games/coming_soon";
const apiKey = process.env.SCRAPER_API_KEY;

const apiUrl = `https://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(
  targetUrl
)}`;

const fetchPageHtml = async () => {
  try {
    const response = await fetch(apiUrl);
    const body = await response.text();

    return new JSDOM(body).window.document;
  } catch (error) {
    console.log("Error: ", error);
  }
};

const doc = await fetchPageHtml();

const fetchAllGamesLinks = () => {
  const gamesLinks = [...doc.querySelectorAll(".media > .media-body > a")].map(
    (a) => a.href
  );

  for (let link of gamesLinks) {
    const absoluteUrl = new URL(link, baseUrl).href;
    console.log(absoluteUrl);
  }
};

fetchAllGamesLinks();
