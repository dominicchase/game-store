const mongoose = require("mongoose");

const { Game } = require("../models/game");

const sharp = require("sharp");

module.exports = {
  createGame: async (req, res) => {
    const { name, numInStock, price } = req.body;
    const { buffer } = req.file;

    const resizedImage = await sharp(buffer)
      .resize({ width: 300 })
      .toFormat("jpeg")
      .toBuffer();

    try {
      const game = new Game({
        name,
        price,
        image: {
          data: Buffer.from(resizedImage, "binary"),
          contentType: "application/octet-stream",
        },
        numInStock,
      });

      const savedGame = await game.save();

      return res.status(201).send(savedGame);
    } catch (error) {
      res.status(500).json({ error: "Failed to create game" });
    }
  },

  deleteGame: async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid ID...");
    }

    Game.findByIdAndRemove(req.params.id)
      .then((game) => {
        if (game) {
          return res
            .status(200)
            .json({ success: true, message: "Game removed..." });
        } else {
          return res
            .status(404)
            .json({ success: false, message: "Game not removed..." });
        }
      })
      .catch((err) => res.status(500).json({ success: false, error: err }));
  },

  getAllPlatforms: async (req, res) => {
    const gameList = (await Game.find().select("category")).map(
      (game) => game.category
    );

    res.send([...new Set(gameList)]);
  },

  getGameById: async (req, res) => {
    try {
      const game = await Game.findById(req.query.id);
      res.status(200).send(game);
    } catch {
      res.status(500).json({ status: 500, message: "" });
    }
  },

  getGames: async (req, res) => {
    // let filter = {};

    // if (req.query.category) {
    //   filter = { category: req.query.category };
    // }

    try {
      const games = await Game.find();
      res.status(200).send(games);
    } catch (event) {
      res.status(500).json({ status: 500, message: "" });
    }
  },

  updateGame: async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid ID...");
    }

    var game = await Game.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        price: req.body.price,
        category: req.body.category,
        numInStock: req.body.numInStock,
      },
      { new: true }
    );

    if (!game) {
      return res.status(500).send("Game can not be updated...");
    }

    return res.send(game);
  },
};
