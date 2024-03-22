const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("gameMasters", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

const games = sequelize.define("games", {
  title: {
    type: Sequelize.STRING,
  },
  genre: {
    type: Sequelize.STRING,
  },
  year: {
    type: Sequelize.INTEGER,
  },
});

// games.sync({ force: true });

module.exports = {
  db: {
    sequelize,
    games,
  },
};
