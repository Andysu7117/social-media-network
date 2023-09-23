const connection = require("../config/connection");
const { User, Thought } = require("../models");

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("connected");

  let userCheck = await connection.db
    .listCollections({ name: "user" })
    .toArray();
  if (userCheck.length) {
    await connection.dropCollection("user");
    console.log("User collection dropped.");
  }

  let thoughtCheck = await connection.db
    .listCollections({ name: "thought" })
    .toArray();
  if (thoughtCheck.length) {
    await connection.dropCollection("thought");
    console.log("User collection dropped.");
  }

  const users = [
    {
      username: "alice123",
      email: "alice@example.com",
      thoughts: [],
      friends: [],
    },
    {
      username: "bob456",
      email: "bob@example.com",
      thoughts: [],
      friends: [],
    },
  ];

  const thoughts = [
    {
      thoughtText: "Mongoose is fun!",
      username: "alice123",
      reactions: [
        {
          reactionBody: "I totally agree!",
          username: "bob456",
        },
        {
          reactionBody: "It's interesting.",
          username: "alice123",
        },
      ],
    },
    {
      thoughtText: "I love coding!",
      username: "bob456",
      reactions: [
        {
          reactionBody: "Coding is life.",
          username: "alice123",
        },
      ],
    },
  ];

  const insertedUsers = await User.collection.insertMany(users);
  console.log("Inserted Users:", insertedUsers);

  const insertedThoughts = await Thought.collection.insertMany(thoughts);
  console.log("Inserted Thoughts:", insertedThoughts);

  await User.updateOne(
    { _id: insertedUsers.insertedIds["0"] },
    { $push: { friends: insertedUsers.insertedIds["1"] } }
  );
  await User.updateOne(
    { _id: insertedUsers.insertedIds["1"] },
    { $push: { friends: insertedUsers.insertedIds["0"] } }
  );
  await User.updateOne(
    { _id: insertedUsers.insertedIds["0"] },
    { $push: { thoughts: insertedThoughts.insertedIds["0"] } }
  );
  await User.updateOne(
    { _id: insertedUsers.insertedIds["1"] },
    { $push: { thoughts: insertedThoughts.insertedIds["1"] } }
  );

  console.table(users);
  console.table(thoughts);
  console.info("Seeding complete! 🌱");
  process.exit(0);
});
