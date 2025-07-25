import fs from "fs";

// Twitch developer authentication credentials
const CLIENT_ID = "";
const ACCESS_TOKEN = "";

async function fetchUpcomingGames() {
  const query = `
    fields name, genres.name, platforms.name, first_release_date, involved_companies.company.name, cover.image_id, videos.video_id;
    sort first_release_date desc;
    where first_release_date != null & first_release_date > ${Math.floor(
      Date.now() / 1000
    )};
    limit 10;
  `;

  const response = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": CLIENT_ID,
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      Accept: "application/json",
    },
    body: query,
  });

  const data = await response.json();

  // Formatting data
  const games = data.map((game) => ({
    name: game.name,
    genre: game.genres?.map((g) => g.name) || [],
    platforms: game.platforms?.map((p) => p.name) || [],
    releaseDate: game.first_release_date
      ? new Date(game.first_release_date * 1000).toDateString()
      : "Unknown",
    publishers: game.involved_companies?.map((c) => c.company.name) || [],
    profileImage: game.cover
      ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
      : null,
    trailerLink: game.videos?.[0]
      ? `https://www.youtube.com/watch?v=${game.videos[0].video_id}`
      : null,
  }));

  console.log(games);

  // Optionally saving to JSON
  fs.writeFileSync("upcoming_games.json", JSON.stringify(games, null, 2));
}

fetchUpcomingGames();
