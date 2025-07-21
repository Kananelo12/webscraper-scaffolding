// TODO: write this file!
// import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const urlParam = process.argv[2];

if (!urlParam) {
  console.log("Expecting a page url argument");
  process.exit(1);
}

/**
 * This function asynchronously fetches the HTML content of a webpage using the provided
 * URL.
 * @param pageUrl - A parameter of type string, representing the webpage to fetch HTML from
 * @returns Returns a Promise that resolves to the `document` object
 * of the fetched page's HTML content.
 */
const fetchPageHtml = async (pageUrl) => {
  try {
    const response = await fetch(pageUrl);
    const body = await response.text();

    // console.log(body);
    return new JSDOM(body).window.document;
  } catch (error) {
    console.log("Error: ", error);
  }
};

const doc = await fetchPageHtml(urlParam);

/**
 * This function extracts all links starting with "https://" from a document and logs
 * them to the console.
 */
const extractAllLinks = () => {
  console.log("\n------------------ All Links Scraped ------------------");
  const links = [...doc.querySelectorAll("a")]
    .map((a) => a.href)
    .filter((href) => href.startsWith("https://"));

  console.log(links);
};

extractAllLinks();

/**
 * This function scrapes all image URLs from a webpage and logs the absolute URLs.
 */
const extractAllImages = () => {
  const images = [...doc.querySelectorAll("img")].map((img) => img.src);

  console.log("\n------------------All Images Scraped ------------------");
  for (let image of images) {
    const absoluteUrl = new URL(image, urlParam).href;
    console.log("\nImage: ", absoluteUrl);
  }
};

extractAllImages();
