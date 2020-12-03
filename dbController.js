const { MongoClient } = require("mongodb");
const url = require("./dbConnector");
const dbName = "john-test";

const dbController = {
  async insertMovieInTheatersToDB(moviesDocument) {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
      await client.connect();
      console.log("Connected correctly to server");
      const db = client.db(dbName);

      const col = db.collection("movies");

      const options = { ordered: true };
      const result = await col.insertMany(moviesDocument, options);
      console.log(`${result.insertedCount} movies were inserted`);
    } catch (err) {
      console.log(err.stack);
    } finally {
      await client.close();
    }
  },
  async insertMovieThisWeekToDB(moviesDocument) {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
      await client.connect();
      console.log("Connected correctly to server");
      const db = client.db(dbName);

      const col = db.collection("movies_thisweek");

      const options = { ordered: true };
      const result = await col.insertMany(moviesDocument, options);
      console.log(`${result.insertedCount} movies were inserted`);
    } catch (err) {
      console.log(err.stack);
    } finally {
      await client.close();
    }
  },
  async getMovieInTheaters(req, res) {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection("movieIntheaters");
      const options = {
        sort: { releaseDate: -1 },
      };
      const cursor = await col.find(null, options);
      // print a message if no documents were found
      if ((await cursor.count()) === 0) {
        console.log("No documents found!");
      }
      res.json(await cursor.toArray());
    } finally {
      await client.close();
    }
  },
  async getMovieThisWeek(req, res) {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection("movies_thisweek");
      const cursor = col.find();
      // print a message if no documents were found
      if ((await cursor.count()) === 0) {
        console.log("No documents found!");
      }
      res.json(await cursor.toArray());
    } finally {
      await client.close();
    }
  },
  async getOneLatestMovie(type) {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      const col =
        type === "current"
          ? db.collection("movies")
          : type === "future"
          ? db.collection("movies_thisweek")
          : null;
      const options = {
        sort: { releaseDate: -1 },
      };
      const cursor = await col.find(null, options);
      // print a message if no documents were found
      if ((await cursor.count()) === 0) {
        console.log("No documents found!");
      }
      const result = await cursor.toArray();
      // console.log(result.map((item) => item.name));
      return result;
    } finally {
      await client.close();
    }
  },
  async getLatestTenMoviesInTheaters() {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection("movies");
      const options = {
        sort: { releaseDate: -1 },
      };
      const cursor = await col.find(null, options).limit(10);
      // print a message if no documents were found
      if ((await cursor.count()) === 0) {
        console.log("No documents found!");
      }
      return await cursor.toArray();
    } finally {
      await client.close();
    }
  },
  async getLatestTenMoviesThisWeek() {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection("movies_thisweek");
      const options = {
        sort: { releaseDate: -1 },
      };
      const cursor = await col.find(null, options).limit(10);
      // print a message if no documents were found
      if ((await cursor.count()) === 0) {
        console.log("No documents found!");
      }
      return await cursor.toArray();
    } finally {
      await client.close();
    }
  },
};

module.exports = dbController;
