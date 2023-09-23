const connection = require("../config/connection");
const { addFriend } = require("../controllers/userController");
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

  await User.collection.insertMany(users);

  await Thought.collection.insertMany(thoughts);

  await User.updateOne(
    { _id: users.ops[0]._id },
    { $push: { friends: users.ops[1]._id } }
  );

  // Add alice123 (first user) as a friend to bob456 (second user)
  await User.updateOne(
    { _id: users.ops[1]._id },
    { $push: { friends: users.ops[0]._id } }
  );

  await User.updateOne(
    { _id: users.ops[0]._id },
    { $push: { thoughts: thoughts.ops[0]._id } }
  );

  await User.updateOne(
    { _id: users.ops[1]._id },
    { $push: { thoughts: thoughts.ops[1]._id } }
  );

  console.table(users);
  console.table(thoughts);
  console.info("Seeding complete! 🌱");
  process.exit(0);
});
