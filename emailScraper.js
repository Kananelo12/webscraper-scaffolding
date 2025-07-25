import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;
const TARGET_URL = "https://www.ibba.org/wp-json/brokers/all";
const SCRAPER_API_URL = `http://api.scraperapi.com/?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(
  TARGET_URL
)}`;

async function scrapeBrokers() {
  try {
    console.log("Navigating through ScraperAPI...");
    const response = await axios.get(SCRAPER_API_URL);
    const brokers = response.data;

    const cleanedBrokerData = brokers.map((broker) => ({
      firstname: broker.first_name || "N/A",
      contact: broker.company || "N/A",
      email: broker.email || "N/A",
    }));

    console.log(` Total brokers found: ${cleanedBrokerData.length}`);
    console.table(cleanedBrokerData.slice(0, 10));
  } catch (error) {
    console.error(" Error fetching broker data:", error.message);
  }
}

scrapeBrokers();
