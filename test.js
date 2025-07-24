import { JSDOM } from "jsdom";

const baseUrl = "https://www.igdb.com";
const targetUrl = "https://www.igdb.com/games/coming_soon";
const apiKey = "0db44c577641137229b1b71190b4c880";

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

const fetchAllGameLinks = () => {
  const gameLinks = [...doc.querySelectorAll(".media > .media-body > a")].map(
    (a) => a.href
  );

  const gameUrls = [];

  for (let game of gameLinks) {
    let absoluteGameUrl = new URL(game, baseUrl).href;
    gameUrls.push(absoluteGameUrl);
  }
  //   console.log(gameUrls);
  return gameUrls;
};

fetchAllGameLinks();
