import { JSDOM } from "jsdom";
import dotenv from "dotenv";

dotenv.config();

const baseUrl = "https://www.igdb.com";
const targetUrl = "https://www.igdb.com/games/coming_soon";
const apiKey = process.env.SCRAPER_API_KEY;
const apiUrl = `https://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(
  targetUrl
)}`;

/**
 * @param pageUrl - a string representing the URL of the web page
 * @returns The function `fetchPageHtml` is returning a `Document` object representing the HTML content
 * of the page fetched from the `pageUrl`.
 */
const fetchPageHtml = async (pageUrl) => {
  try {
    const response = await fetch(pageUrl);
    const body = await response.text();

    return new JSDOM(body).window.document;
  } catch (error) {
    console.log("Error: ", error);
  }
};

/**
 * This function extracts and returns an array of genres from a given document.
 * @param doc - a JSDOM document
 * @returns The function takes a document object as input and extracts the text content of
 * anchor elements within specific classes. It returns an array of genre names extracted from those
 * anchor elements.
 */
function getGenres(doc) {
  const genres = [
    ...doc.querySelectorAll(
      ".sc-dxjrPO.cbyKNd.MuiTypography-root.MuiTypography-body1 > a"
    ),
  ].map((a) => a.textContent.trim());

  return genres;
}

(async () => {
  // Get the list of game URLs
  const pageDoc = await fetchPageHtml(apiUrl);

  const gameLinks = Array.from(
    pageDoc.querySelectorAll(".media > .media-body > a")
  ).map((a) => new URL(a.getAttribute("href"), baseUrl).href);

  const gameImageCovers = [
    ...pageDoc.querySelectorAll(
      ".media > .media-left > .width-40 > .game_cover > img"
    ),
  ].map((img) => new URL(img.getAttribute("src"), baseUrl).href);

  // For each URL, fetch and scrape game details
  const games = [];
  for (let i = 0; i < gameLinks.length; i++) {
    const url = gameLinks[i];
    const coverUrl = gameImageCovers[i];

    console.log("\nFetching:", url);
    const gameDoc = await fetchPageHtml(
      `https://api.scraperapi.com/?api_key=${apiKey}&render=true&url=${encodeURIComponent(
        url
      )}`
    );

    const name = gameDoc.querySelector(
      ".sc-dxjrPO.hstaEa.MuiTypography-root.MuiTypography-h3"
    ).textContent;
    const genrePlatformList = getGenres(gameDoc);
    // All elements except the last one are genres
    const genres = genrePlatformList.slice(0, -1);
    // The last element is the platform
    const platforms = [genrePlatformList.at(-1)];
    const releaseDate = gameDoc.querySelector(
      ".sc-dxjrPO.dfUQBt.MuiTypography-root.MuiTypography-body1.sc-bRoQge.lhWUEb"
    ).textContent;
    const publishers = " - ";

    games.push({
      name,
      genres,
      platforms,
      releaseDate,
      publishers,
      coverUrl,
    });
    console.log(JSON.stringify(games, null, 2));
  }

  // Store data in json file
})();
