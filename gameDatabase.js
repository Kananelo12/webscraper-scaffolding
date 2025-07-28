import puppeteerExtra from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs/promises";

// Using puppeteer stealth to bypass Cloudflare and any anti‑bot measures
puppeteerExtra.use(StealthPlugin());

const TARGET_URL = "https://www.igdb.com/games/coming_soon";

(async () => {
  const browser = await puppeteerExtra.launch({ headless: true });
  const page = await browser.newPage();

  // Go to target website and wait for network activity to idle
  // This ensures that the page is fullt loaded before interactions
  await page.goto(TARGET_URL, { waitUntil: "networkidle2" });
  await page.waitForSelector(".media");

  /* This code snippet is using `page.$` to evaluate a function on all elements that match the
  `.media` selector on the page. */
  const gameCards = await page.$$eval(".media", (cards) =>
    cards.map((card) => {
      const linkEl = card.querySelector(".media-body > a");
      const imgEl = card.querySelector(".media-left .game_cover img");
      return {
        gameUrl: linkEl ? linkEl.href : "",
        gameCoverUrl: imgEl ? imgEl.src : "",
      };
    })
  );

  // Limit the fetched cards to 10
  const limitedGameCards = gameCards.slice(0, 10);

  const games = [];
  for (let i = 0; i < limitedGameCards.length; i++) {
    const { gameUrl, gameCoverUrl } = limitedGameCards[i];
    console.log(`\nFetching [${i + 1}/${limitedGameCards.length}]:`, gameUrl);

    // Fetch each game page
    await page.goto(gameUrl, { waitUntil: "networkidle2" });
    await page.waitForSelector("h1");

    const name = await page.$eval("h1", (h) => h.textContent.trim());

    // Extract genre+platform tags
    const tags = await page.$$eval(
      ".sc-dxjrPO.cbyKNd.MuiTypography-root.MuiTypography-body1 > a",
      (els) => els.map((a) => a.textContent.trim())
    );

    // Split genres and platform into separate arrays
    const genres = tags.slice(0, -1);
    const platforms = tags.slice(-1);

    const releaseDate = await page
      .$eval(
        ".sc-dxjrPO.dfUQBt.MuiTypography-root.MuiTypography-body1.sc-bRoQge.lhWUEb",
        (el) => el.textContent.trim()
      )
      .catch(() => "");

    const publishers = await page.$$eval("p", (paras) => {
      const p = paras.find((p) =>
        p.textContent.trim().startsWith("Publishers:")
      );
      return p
        ? Array.from(p.querySelectorAll("a")).map((a) => a.textContent.trim())
        : [];
    });

    games.push({
      name,
      genres,
      platforms,
      releaseDate,
      publishers,
      gameCoverUrl,
      gameUrl,
    });

    console.log(JSON.stringify(games[i], null, 2));
  }

  // Save all game information to a JSON file
  await fs.writeFile("games.json", JSON.stringify(games, null, 2), "utf-8");
  console.log(`\nStored ${games.length} games to games.json`);

  await browser.close();
})();
