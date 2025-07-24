// TODO: write this file!
import { JSDOM } from "jsdom";

const urlParam = process.argv[2];
if (!urlParam) {
  console.log("Expecting a page url argument!");
  process.exit(1);
}

const fetchPageHtml = async (pageUrl) => {
  try {
    const response = await fetch(pageUrl);
    const body = await response.text();

    console.log(body);
    return new JSDOM(body).window.document;
  } catch (error) {
    console.log("Error:", error);
  }
};

const doc = await fetchPageHtml(urlParam);
