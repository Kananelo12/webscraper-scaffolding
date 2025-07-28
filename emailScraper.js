import { connect } from "puppeteer-real-browser";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import puppeteerExtra from "puppeteer-extra";

puppeteerExtra.use(StealthPlugin());

//The target site and the end-point for the dynamically loaded brokers information
const WEBSITE_URL = "https://www.ibba.org/find-a-business-broker";
const DATA_API_URL = "https://www.ibba.org/wp-json/brokers/all";

async function scrapEmails() {
  var browser;

  try {
    //Connect the browser instance using puppeteer-real-browser connect object with anti-bot detection options
    const response = await connect({
      headless: false,
      fingerprint: true,
      turnstile: true,
      plugins: [StealthPlugin()],
    });

    browser = response.browser;
    const page = response.page;

    await page.goto(WEBSITE_URL, { waitUntil: "networkidle2" });
    console.log("Page loaded");
    //search for the reCAPTCHA iframe selector and continue with the subsequent code processing
    try {
      await page.waitForSelector('iframe[src*="recaptcha"]', {
        timeout: 30000,
      });
    } catch {}
    //make the API call to the brokers data end-point after the target page is loaded
    console.log("Fetching broker data from backend endpoint...");
    const brokers = await page.evaluate(async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      return await res.json();
    }, DATA_API_URL);
    //create a new array of brokers object with only desired properties
    const cleaned = brokers.map((b) => ({
      firstname: b.first_name || "N/A",
      contact: b.company || "N/A",
      email: b.email || "N/A",
    }));

    console.log(`Total brokers found: ${cleaned.length}`);
    console.table(cleaned.slice(0, 10));
  } catch (error) {
    console.error("Error during scraping:", error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

scrapEmails();
