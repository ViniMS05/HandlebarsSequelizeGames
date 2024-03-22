const express = require("express");
const { engine } = require("express-handlebars");

const app = express();

const { db } = require("./models/database");

app.engine("handlebars", engine({ defaultLayout: "main" }));

app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", async (_req, res) => {
  const games = (await db.games.findAll()).map((post) => post.toJSON());

  res.render("home", { games });
});

app.get("/create", (_req, res) => {
  res.render("create");
});

app.get("/games/update/:id", async (req, res) => {
  const games = await db.games.findOne({ where: { id: req.params.id } });

  if (!games) return res.status(404).json({ message: "GAME_NOT_FOUND" });

  res.render("update", { game: games.toJSON() });
});

app.get("/games/delete/:id", async (req, res) => {
  try {
    await db.games.destroy({ where: { id: req.params.id } });
  } catch (err) {
    console.log(err);
  }

  res.redirect("/");
});

app.post("/games", async (req, res) => {
  console.log(req.body);
  try {
    await db.games.create({
      title: req.body.title,
      genre: req.body.genre,
      year: req.body.year,
    });
    res.redirect("/");
  } catch (err) {
    res.status(500).json({ message: "Unable to add new game.", err });
  }
});
app.post("/games/:id", async (req, res) => {
  try {
    const gameId = req.params.id;

    const { title, genre, year } = req.body;

    await db.games.update({ title, genre, year }, { where: { id: gameId } });

    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error to update game info.");
  }
});

app.listen(8080, () => {
  console.log("Server running at http://localhost:8080");
});
