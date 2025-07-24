import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const SCRAPER_API_KEY = "c8075e4c88612cd64eede9dbf913aa9d";
const searchQuery = "Tec";
const targetUrl = `https://www.ibba.org/find-a-business-broker/?nameSearch=${encodeURIComponent(
  searchQuery
)}`;
const scraperApiUrl = `https://api.scraperapi.com/?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(
  targetUrl
)}`;

const run = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--start-maximized", "--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  try {
    console.log("Navigating to IBBA page...");
    await page.goto(scraperApiUrl, {
      waitUntil: "networkidle2",
      timeout: 90000,
    });

    await page.waitForSelector(".brokerNameWrapper a", { timeout: 15000 });

    const brokers = await page.evaluate(() => {
      return [...document.querySelectorAll(".brokerNameWrapper > a")].map(
        (a) => {
          return {
            href: a.href,
            text: a.textContent.trim(),
            outerHTML: a.outerHTML,
          };
        }
      );
    });

    console.log("brokers found: ", brokers);
  } catch (err) {
    console.error("Error during scraping:", err.message);
  } finally {
    await browser.close();
  }
};

run();
