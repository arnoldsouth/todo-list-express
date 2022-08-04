// Create a constant variable `express` and assign the imported `express` module to it
const express = require("express");

// Create a constant variable `app` and assign the `express` application to it
const app = express();

// Create a constant variable `MongoClient` and assign the imported `mongodb` module with the class `MongoClient` to it, using the `connect` method that came with the module
const MongoClient = require("mongodb").MongoClient;

// Create a constant variable `PORT` and assign the port number `2121` to it
const PORT = 2121;

// After importing the `dotenv` module, call the `config` method on it to load environment variables within the `.env` file into the `process.env` property
require("dotenv").config();

// Create and declare mutable variables `db`, `dbConnectionStr`, and `dbName`: `db` stores class instance; `dbConnectionStr` stores the connection string using process.env.DB_STRING (DB_STRING stored within .env file); `dbName` stores the name of the database we using
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";

// Call static `connect` method on MongoClient with the object `dbConnectionStr` and its property `useUnifiedTopology` that has a value of `true` in order to use the server and engine
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    // Logs string to the browser's console with `dbName` telling us we've connected to the database successfully
    console.log(`Connected to ${dbName} Database`);
    // Re-assign `db` to `dbName` by using the current MongoClient instance's `db` method
    db = client.db(dbName);
  }
);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (request, response) => {
  const todoItems = await db.collection("todos").find().toArray();
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  response.render("index.ejs", { items: todoItems, left: itemsLeft });
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
});

app.post("/addTodo", (request, response) => {
  db.collection("todos")
    .insertOne({ thing: request.body.todoItem, completed: false })
    .then((result) => {
      console.log("Todo Added");
      response.redirect("/");
    })
    .catch((error) => console.error(error));
});

app.put("/markComplete", (request, response) => {
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true,
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch((error) => console.error(error));
});

app.put("/markUnComplete", (request, response) => {
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: false,
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    .then((result) => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch((error) => console.error(error));
});

app.delete("/deleteItem", (request, response) => {
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    .catch((error) => console.error(error));
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
